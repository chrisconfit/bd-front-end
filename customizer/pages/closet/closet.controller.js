(function() {
  
  angular
    .module('bdApp')
    .controller('closetCtrl', closetCtrl);

  closetCtrl.$inject = ['$filter', '$location', '$window', 'jean','popups', '$scope', 'messages', 'loader', 'user', 'api', '$routeParams', 'apiData'];
  function closetCtrl($filter, $location, $window, jean, popups, $scope, messages, loader, user, api, $routeParams, apiData) {
	  
    var vm = this;   
		popups.closeAll();
		vm.popups=popups.get();
		vm.messages=messages.get();
		vm.data = apiData;
		console.log("LLLL");
		console.log(vm.data.lookup('order_statuses', 'id', 5, 'name'));
		//Set up Jean
		vm.jeans;
		api.call('getMyJeans', null, function(results){
			vm.jeans = results;
		});
		
		//Set up orders
		vm.orders = [];		
    api.call('getMyOrders', null, function(result){
	    vm.orders = result;
	    
	    for(var i=0; i<vm.orders.length; i++){
	    	vm.checkUrl(vm.orders[i]);
			}
    });
  
  
    //For images... if we have the default images saved, see if a thumbnail exists for the jean... if not, try and create it.
    vm.checkUrl = function(order){
      console.log("CHECKING URL!!!");
      var image_url = order.order_items[0].jean_image_url;
    
      //image_url does not contain "default"... It's a good URL, let's use it.
      if ((image_url).indexOf('default.jpg') < 0){
        return order.order_items[0].jean_image_url;
      }
    
      //image_url is set to the default. Let's build a data url and try to get a thumb.
      else{
        var data_code = api.getDataCode(order.order_items[0]);
        jean.testJeanForExistingImage(order.order_items[0], data_code, function(jeanData){
        	
        	console.log("TEST FOR EXSIST RESULT");
        	console.log(jeanData);
        	console.log(order);
        	
					if (jeanData.image && jeanData.image.data) {
            api.call('uploadJeanThumb', order.order_items[0].image, function (result) {
              order.order_items[0].jean_image_url = result.url + "?tested=true";
              //save the order
              api.call('updateMyOrder', order);
            });
          }else{
            order.order_items[0].jean_image_url = jeanData.jean_image_url + "?tested=true";
            //save the order
            api.call('updateMyOrder', order);
					}
        });
      }
    };
    
		vm.onload=function(){
			$scope.vm = vm;
		};
		
		//Edit User
		vm.userForm = {};
		vm.userForm.editing={};
		vm.userForm.saving={};
		vm.userForm.data = {};
		vm.userForm.feedback={
			"type":"",
			"message":"",
		}
		
		vm.changeOrderItemName = function(){
			var changeOrder = vm.displayOrder.order_items[0].id;
			var changeName = vm.displayJean.jean_name;
			api.call('postOrderItem', {id:changeOrder, jean_name:changeName});
		}
		
		vm.userForm.cancel = function(field){
			vm.userForm.editing[field] = false;
			vm.user[field] = vm.userForm.data[field];
		};
		
		vm.userForm.editField = function(field){
			vm.userForm.data[field] = angular.copy(vm.user[field]);
			vm.userForm.editing[field]=true;
			
		}
		
		vm.formatDate = function(date, format){
			var format = format || "MM/dd/yyyy"
			var date = new Date(date);
			return $filter('date')(date, format);
		}		
		
		//Validation functions
		function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
		}
		
		function validatePhoneNumber(inputtxt) {
		  var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
		  return inputtxt.match(phoneno);
		}
		
		vm.userForm.validate = function(field, data){
			
			if (field == 'email'){
				if (validateEmail(data)) return true;
				else {
					messages.set("Please enter a valid email address", "error");
					return false;
				}
			}
			
			else if (field == 'phoneNumber'){
				if (validatePhoneNumber(data)) return true;
				else {
					messages.set("Please enter a valid phone number", "error");
					return false;
				}
			}
			
			else return true;
		}

		
		vm.userForm.save = function(field){
			//if (vm.user[field] == "") vm.user[field] = null;
			if (vm.userForm.validate(field, vm.user[field])){
				user.update(vm.user, function(result){
					vm.userForm.saving[field] = false;
					vm.userForm.editing[field] = false;
					//vm.userForm.data[field] = vm.user[field];
				});
			}
		}
		

    
   	
	 vm.user = user.get();	

	    	
				
		/*
		* Password Form
		*/
		vm.passForm = {
			"editing" : false,
			"currentPass" : "",
			"newPass": "",
			"newPassConfirm" : "",
			"clear": function(){
				vm.passForm.editing = false;
				vm.passForm.currentPass = "";
				vm.passForm.newPass = "";
				vm.passForm.newPassConfirm = "";
				messages.reset();
			}
		};
		
		
		function validatePassword(password){
			var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$/;
			return re.test(password);
		}
		
		vm.validatePasswordForm = function(){
		
			if (!validatePassword(vm.passForm.newPass)){
				messages.set("A valid password must: <ul><li>Be between 6 and 50 characters</li><li>Contain at least one number</li><li>Contain at least one uppercase letter</li><li>Contain at least one lowercase letter</li><li>Contain at least one special character (\"!,@,#,$,%,^,&, or *\")</li>");	
			}
			
			if (vm.passForm.newPass !== vm.passForm.newPassConfirm){
				messages.set("New Password and Confirmation do not match", "error");
				return false;
			}
			
			return true;	
		};
		
		
    vm.changePassword = function () {
	    messages.reset();
	    if (vm.validatePasswordForm()){
		    var passwordData ={
			    id:vm.user.id,
			    password:vm.passForm.newPass,
			    old_password:vm.passForm.currentPass
			  };
				user.update(passwordData, function(result){
					vm.passForm.clear();
					messages.set("Password successfully changed.", "success");
				},
				function(err){	
					messages.set(err.message, "error");
				});
		  }
    };
		
    /*
		vm.reOrder = function(orderId){
			$location.path('/order/'+orderId+'/re-order');
		};
		*/
    vm.reOrder = function(reOrder){
      var orderCreateObj = {
      	price:reOrder.price,
				shipping_phone:reOrder.shipping_phone,
				shipping_name:reOrder.shipping_name,
				shipping_address_id:reOrder.shipping_address_id,
				user_id:reOrder.user_id,
				vendor_id:reOrder.vendor_id,
				rep_id:reOrder.rep_id
			};
			
			orderCreateObj.payment_status_id=1;
      orderCreateObj.order_status_id=5;
      orderCreateObj.order_type_id=5;
      orderCreateObj.reorder_item_id = reOrder.order_items[0].id;
  
      api.call('placeMyOrder', orderCreateObj, function(newOrder){
      	$location.path('/pay/'+newOrder.id);
      });
      
		};

		vm.copyJean = function(orderItem){
			dataCode = api.getDataCode(orderItem);
			jean.setup(dataCode, true);
			$location.path('/customizer');
		};
		
		vm.displayJean={};
		vm.selectJean = function(jean){
			vm.popups.jeanProfile = true; 
			vm.displayJean=jean
		};
		
		vm.selectOrder = function(order){
			vm.popups.orderProfile = true; 
			vm.displayOrder=order;
			vm.displayJean = order.order_items[0];
		};
	
		function findJeanbyId(jeanId){
			for (var j=0; j < vm.jeans.length; j++) {
	      if (vm.jeans[j].id === jeanId) return j;
      }
  	}

		vm.deleteJean = function(jeanId){
			api.call('deleteMyJean', jeanId, function(result){
				var index = findJeanbyId(jeanId);
				vm.jeans.splice(index, 1);
			});
		};
		
		vm.orderJean = function(jeanId){
			$location.path('/order/'+jeanId);
		};
  
    vm.payInvoice = function(orderId){
      $location.path('/pay/'+orderId);
		};
		//Get User
		
		
	
  
  
  }
  


})();