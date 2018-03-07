'use strict';

angular.module('inspinia')
  .controller('OrdersEditController', ['$timeout', '$filter', '$q', '$scope', 'orderData', 'toaster', '$uibModal','api', 'user', '$state', 'SweetAlert',
  function ($timeout, $filter, $q, $scope, orderData, toaster, $uibModal, api, user, $state, SweetAlert) {

    var vm = this;
		vm.user = user.get(true);
		$scope.f = {};

		//Determine whether or not this is a new order
    vm.newOrder = orderData===null || orderData.hasOwnProperty('requested_fabric_ids');

		//Base object for new orders
		var newOrderData = {
			order_status_id: 5,
			payment_status_id: 1,
			order_type_id:null,
			order_items:[{
				gender_option_id:1,
				style_option_id:1,
				top_thread_id:1,
				accent_thread_id:1,
				bottom_thread_id:1,
				fabric_id:1000,
        payment_status_id:1,
				jean_name:"My New Jeans"
			}]
		};
	
		
		
		//Add extra data for fit match orders
		if (orderData && orderData.hasOwnProperty('requested_fabric_ids')){
			newOrderData.order_type_id = 3;
      newOrderData.order_items[0].jean_name = "My New Fit Match Jeans";
      newOrderData.shipping_name = orderData.user.first_name+" "+orderData.user.last_name;
      newOrderData.fit_match_id = orderData.id;
      newOrderData.shipping_address_id = orderData.shipping_address_id;
      newOrderData.shipping_phone=orderData.shipping_phone;
      newOrderData.address = orderData.address;
      newOrderData.comment = "Order created from Fit Match #"+$state.params.fitMatchId;
		}

		//Build Order data
		vm.order = vm.newOrder ? newOrderData : orderData;
		vm.originalJean = vm.newOrder ? null : angular.copy(vm.order.order_items[0]);
    vm.orderUser = orderData && orderData.user ? orderData.user : null;
		if (!vm.newOrder) {
      vm.order.fit_date = vm.order.fit_date ? vm.order.fit_date : null;
      vm.order.dob = vm.order.dob ? vm.order.dob : null;
      vm.order.dueDate = vm.order.dueDate ? vm.order.dueDate : null;
    }

    vm.convertToCurrency = function(){
	    var price = vm.order.price.replace("$","");
	    var price = $filter('currency')(price, "");
	    if(!price) price = "Please enter a valid price";
			vm.order.price = price
  	};
    
		//Set up app data...
		vm.data={};
    $scope.$watch(angular.bind(this, function () {
      return this.data;
    }), function (newVal) {
    	console.log("DATA CHANGED!!!");
    	console.log(newVal);
			buildTimeline();
    });
    vm.data = api.getData();


		//Edit Jean details...
		vm.EditMode= vm.newOrder ? true : false;
		vm.beginJeanEdit = function(){
			vm.EditMode = true;
			vm.BeforeEdit = angular.copy(vm.order.order_items[0]);
		};
		vm.clearJeanEdit = function(){
			vm.EditMode = false;
			vm.order.order_items[0] = angular.copy(vm.BeforeEdit);
		};

		/*
		vm.billingSameAsShipping = function(){
			if (!vm.order.billingAddress || Object.keys(vm.order.billingAddress)<1) vm.order.billingAddress = vm.order.shippingAddress;
			return angular.equals(vm.order.billingAddress, vm.order.shippingAddress);
		}
		*/
		
		vm.formatDate = function(date){
			return $filter('date')(new Date(date+" UTC"), "MM/dd/yyyy h:m a");
		};
		
		$scope.$watch(angular.bind(this, function () {
		  return this.order.fit_date;
		}), function (newVal) {
			if (newVal && newVal._d){
        vm.order.fit_date = newVal._d.toISOString().slice(0,10);
			}
		});
		
		$scope.$watch(angular.bind(this, function () {
		  return this.order.due_date;
		}), function (newVal) {
			if (newVal && newVal._d){
				var d = newVal._d.toISOString().slice(0,10);
				vm.order.due_date = d;
			}
		});
		
		$scope.$watch(angular.bind(this, function () {
		  return this.order.dob;
		}), function (newVal) {
			if (newVal && newVal._d){
				var d = newVal._d.toISOString().slice(0,10);
				vm.order.dob = d;
			}
		});
  
    $scope.$watch(angular.bind(this, function () {
      return this.orderUser;
    }), function (newVal, oldVal) {
     	if(!vm.newOrder) return false;
      if(newVal && !oldVal || newVal.id && newVal.id !== oldVal.id){
         vm.order.shipping_phone = newVal.phone;
			}
    });
		
		
		/*										    				*\
		*									    						*
		*				    											*
		* * * * *  Address Modal 	* * * * * 
		*												    			*	
		\*	  								    				*/
	
	  vm.editAddress = function (type, icon) {
	    var modalInstance = $uibModal.open({
	      templateUrl: 'app/components/address-choice/address.html',
	      controller: 'AddressController',
	      resolve: {
	        data: {
		        addressType : type,
		        icon : icon,
		        selected:vm.order.shipping_address_id
		      },
	        save : function(){
		        return vm.saveAddress;
	        },
	        address: function () {
	          return vm.orderUser.addresses;
	        }
	      }
	  	});
	  };
  
  
	  vm.saveAddress = function(add, callback){
	    if (add === parseInt(add, 10)){
		    vm.order.shipping_address_id = add;
		    for (var i=0; i<vm.orderUser.addresses.length; i++){
			  	var thisAdd = vm.orderUser.addresses[i];
			  	if (thisAdd.id == add) vm.order.address=thisAdd;
		    }
		    if(callback)callback();
	    }
			else{
				var data = {userId:vm.orderUser.id, address:add};
				api.call('postAddress', data, function(result){
					vm.orderUser.addresses.push(result);
					vm.order.address=result;
			    vm.order.shipping_address_id = result.id;
			    if(callback)callback();
				});
			}
	  };
    
    
    
	  /*  	  						    				*\
		*								    						*
		*				   											*
		* * * * *  User Modal 	* * * * * 
		*				  	 					    			*	
		\*	  							    				*/
	     
	  vm.editUser = function(){
	    var modalInstance = $uibModal.open({
	      templateUrl: 'app/components/user-choice/userChoice.html',
	      controller: 'UserChoiceController',
	      resolve: {
	        choose : function(){
		        return vm.chooseClient;
	        },
	        orderUser : function() {
	          return vm.orderUser;
	        },
	        api : function() {
	          return api;
	        }
	      }
	  	});
	  };
	  
	  function getPrimaryAddress(addresses){
			if(!addresses || !addresses.length) return false;
			for (var i=0; i<addresses.length; i++) {
				if (addresses[i].primary === true) return addresses[i];
			}
		}
					
	  vm.chooseClient = function(client){
			api.call('userGet', client.id, function(result){
		    vm.orderUser = result;
		    var primary = getPrimaryAddress(result.addresses);
		    if (primary){
					vm.order.address = primary;
					vm.order.shipping_address_id=primary.id;
				}
	    });
	  };

	  vm.compOrder = function(){
      var order_object = {
        id:vm.order.id,
        payment_status_id:3
      };
      api.call('ordersPost', order_object, function(result){
        vm.order.payment_status_id=3;
      });
    };


    /*  	  						    		  		*\
		*								    			  			*
		*				   								 		  	*
		* * * * *  Key In Modal 	* * * * *
		*				  	 					    		  	*
		\*	  							    				  */

		
    vm.keyinPayment = function(){

      var modalInstance = $uibModal.open({
        templateUrl: 'app/components/key-in-cc/keyInModal.html',
        controller: 'KeyInController',
        resolve: {
          orderData : function() {
            return {
              "user":vm.orderUser,
              "order":vm.order
            };
          },
          api : function(){
						return api;
					},
          confirmation : function(){
            return function(swalSettings){SweetAlert.swal(swalSettings)};
          }
        }
      });
    };

	  /*														*\
		*															*
		*															*
		* * * * *  Timeline 	* * * * *
		*															*
		\*	  												*/


		//Create the "Time from now" text...
		vm.timeFromNow = function(timestamp){
			return moment(new Date(timestamp+' UTC')).fromNow();
		};
		
		//Object 
		vm.timelineForm = {
			message:null
		};
  
    function timelineLookupKeys(field){
      var label, lookup='id', data, ret='name';
      switch(field) {
        case "style_option_id":
          label = "Style";
          data = "style_options";
          break;
      
        case "fit_option_id":
          label = "Fit";
          data = "fit_options";
          break;
      
        case "gender_option_id":
          label = "Gender";
          data = "gender_options";
          ret ="gender";
          break;
      
        case "monogram_thread_id":
          label = "Monogram Thread";
          data = "threads";
          break;
      
        case "fabric_id":
          label = "Fabric";
          data = "fabrics";
          break;
      
        case "top_thread_id":
          label = "Top Thread";
          data = "threads";
          break;
      
        case "bottom_thread_id":
          label = "Bottom Thread";
          data = "threads";
          break;
      
        case "accent_thread_id":
          label = "Accent Thread";
          data = "threads";
          break;
      
        case "vendor_id":
          label = "Vendor";
          data = 'vendors';
          break;
      
        case "rep_id":
          label = "Rep";
          data = 'reps';
          break;
      
        case "order_status_id":
          label = "Order Status";
          data = 'order_statuses';
          break;
      
        case "order_type_id":
          label = "Order Type";
          data = 'order_types';
          break;
      
        case "payment_status_id":
          label = "Payment Status";
          data = "payment_statuses";
          ret = "label";
          break;
      
        case "belt_loop_option_id":
          label = "Belt Loops";
          data = "belt_loop_options";
          ret="label";
          break;
      
        case "hardware_option_id":
          label = "Rivets";
          data = "hardware_options";
          ret = "name";
          break;
      
        case "pocket_option_id":
          label = "Pocket Option";
          data = "pocket_options";
          ret = "label";
          break;
      
        default:
          return false;
      }
      return{
        label:label,
        lookup:lookup,
        data:data,
        ret:ret
      }
    
    }
  
    function correctFieldTitle(title){
      title = title.replace(/_/g, ' ');
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
  
    var simpleFields = [
      "due_date",
      "fit_date",
      "monogram",
      "tracking",
      'jean_name',
      'monogram',
      'waist',
      'seat_down',
      'seat_right',
      'rise',
      'full_rise',
      'thigh_upper_down',
      'thigh_upper_right',
      'thigh_middle_down',
      'thigh_middle_right',
      'thigh_lower_down',
      'thigh_lower_right',
      'outseam',
      'knee_up',
      'knee_right',
      'calf_up',
      'calf_right',
      'leg_opening',
      'price',
      'height',
      'weight'
    ];
  
    function processLogs(logs) {
      var groupedLogs = {};
      for (var i = 0; i < logs.length; i++) {
        var key = logs[i].created_at + "__" + logs[i].user_id;
        if (!groupedLogs[key]) groupedLogs[key] = [];
        groupedLogs[key].push(logs[i]);
      }
      for (var key in groupedLogs) {
        if (groupedLogs.hasOwnProperty(key)) {
          var entryData = key.split("__");
          var entry = {
            created_at: entryData[0],
            user: groupedLogs[key][0].user,
            type: "pencil"
          };
          var messages = [];
          
          
          for (var i = 0; i < groupedLogs[key].length; i++) {
            var log = groupedLogs[key][i];
            var keys = timelineLookupKeys(log.field);
            if (keys) {
              var old_value = vm.data.lookup(keys.data, keys.lookup, log.old_value, keys.ret);
              var new_value = vm.data.lookup(keys.data, keys.lookup, log.new_value, keys.ret);
              messages.push("Changed " + keys.label + " from '" + old_value + "' to '" + new_value + "'");
            }
          
            if (simpleFields.indexOf(log.field) > -1)
              messages.push("Changed " + correctFieldTitle(log.field) + " from '" + log.old_value + "' to '" + log.new_value + "'");
            if (log.field === "notes") messages.push("Edited notes");
            if (log.field === "shipping_address_id") messages.push("Changed Shipping Address");
            if (log.field === "user_id") messages.push("Changed Client");
          }
          if (messages.length) {
            entry.message = messages.join("<br>");
            vm.timeline.push(entry);
          }
        }
      }
    }
    
		function buildTimeline() {
    	
      if (vm.newOrder) return false;
			
      //Init timeline with created_at date.
      vm.timeline = [{message: "Order Created", created_at: vm.order.created_at}];
      
      //Add order comments
      for (var i = 0; i < vm.order.order_comments.length; i++) {
        vm.order.order_comments[i].type = "comment";
      }
      vm.timeline.push.apply(vm.timeline, vm.order.order_comments);
      
      //Add in order logs and order item logs
      var logs = vm.order.logs;
      logs.push.apply(logs, vm.order.order_items[0].logs);
      processLogs(logs);
    }
		

		//Function to add timeline item
	  vm.addTimelineItem = function(){
	    if (!vm.timelineForm.message) return false;
	    var data = {
		    orderId:vm.order.id, 
		    comment:{
		    	message:vm.timelineForm.message,
		    	user_id:vm.user.id,
					type:"message"
	    	}
	    };
			api.call('commentsCreate', data, 
				function(result){
					//Quick fix since this endpoint does not return user name
					result.user={
			    	first_name:vm.user.first_name,
			    	last_name:vm.user.last_name
		    	};
					result.type="comment";
					vm.timeline.push(result);
					vm.timelineForm.message = null;
				}
			);
	  };
    
    
    





		/*														*\
		*															*
		*															*
		* * * * * Save/Create	* * * * * 
		*															*	
		\*	  												*/	
	
	
	
	
		    
    var deleteOrderBox = {
      title: "Are you sure?",
      text: "This order will be deleted forever and you will be redirected to the orders list!",
      type: "warning",
      showCancelButton: true,
			confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: true,
      closeOnCancel: true 
    };
   
		vm.deleteThisOrder = function(){
			SweetAlert.swal(deleteOrderBox,
		    function (isConfirm) {
	        if (isConfirm) {
		        api.call('ordersDelete', vm.order.id, function(result){
              $state.transitionTo('orders.list');
	          });
	        }
		    }
		  );
		};
		
		
		
		var reOrderBox = {
      title: "Re-Order this pair of Jeans?",
      text: "If you confirm, this order will be saved and you will be re-directed to your new order",
      type: "warning",
      showCancelButton: true,
			confirmButtonColor: "#34d289",
      confirmButtonText: "Re-Order",
      cancelButtonText: "Cancel",
      closeOnConfirm: true,
      closeOnCancel: true 
    };
		
		vm.reOrder = function(){
			
			SweetAlert.swal(reOrderBox,
		    function (isConfirm) {
	        if (isConfirm) { 
			      var copyOrderObject = {
							"shipping_name":vm.order.shipping_name,
							"shipping_phone":vm.order.shipping_phone,
							"shipping_address_id":vm.order.shipping_address_id,
							"reorder_item_id":vm.order.order_items[0].id,
							"order_type_id":vm.order.order_type_id,
							"user_id":vm.orderUser.id,
							"comment":"Reordered from order #"+vm.order.id
						};
						
						vm.saveOrder(function(){
							
							api.call('ordersPost', copyOrderObject, function(result){
								$state.transitionTo('orders.edit', {orderId:result.id});
							});
						});
	        }
		    }
			);
	
		};
	  
		
		function jeanHasChanged(){
			var o1 = vm.order.order_items[0];
			var o2 = vm.originalJean;
			return !angular.equals(o1, o2);
		}
		
		vm.saveOrder = function(callback){
			
			if (!$scope.f.orderForm.$valid){
				$scope.f.orderForm.submitted = true;
				return false;
			}
			
			if(vm.orderUser==null){ return false; }

			//toaster.wait('Saving Order...');
			
			var savingToast = toaster.pop({
			  type: 'wait',
			  title: "Saving...",
			  timeout: 9000000
			});			

			var jeanData = vm.order.order_items[0];
			var filename = api.getDataCode(jeanData);
			filename += ".jpg";
			jeanData.image = {filename:filename};
			api.createThumb(jeanData).then(function(blob){
				if (!blob){
					delete jeanData.image;
					jeanData.jean_image_url = "https://s3.amazonaws.com/bluedelta-customizer/images/thumbnails/default.jpg";
				}else{
					jeanData.image.data = blob;
				}

				
				//Save new order...
				if (vm.newOrder){
					jeanData.name = jeanData.jean_name;
					var data = {userId:vm.orderUser.id, jean:jeanData};
					
					//1. Create jean
					api.call('usersCreateJean', data, function(newJean){
						toaster.clear(savingToast);
						toaster.pop({
						  type: 'success',
						  title: "Order Saved!",
						  timeout: 2000
						});			
					
						//2. Create Order
						var orderData = vm.order;
						orderData.user_id = vm.orderUser.id,
						orderData.shipping_name = vm.orderUser.first_name+" "+vm.orderUser.last_name,
						orderData.shipping_address_id = vm.order.shipping_address_id,
						orderData.jean_id = newJean.id;
						
						api.call('ordersPost', orderData, function(newOrder){
							$state.transitionTo('orders.edit', {orderId:newOrder.id});
						});
	
					});
				
				}
				
				//Update existing order...
				else{
					api.call('ordersPost', vm.order, function(result){
						toaster.clear(savingToast);
						toaster.success('Saved Order!');
            vm.EditMode=false;
						vm.order=result;
						console.log(result);
						vm.timeline=null;
            buildTimeline();
            if (callback)callback();
					}, function(err){
						toaster.clear(savingToast);
						toaster.pop({
						  type: 'error',
						  title: "Problem saving order..",
						  timeout: 2000
						});	
					});
				}			
				
			});

	
		}//.saveOrder()...
  
  
    vm.fabric_list_item_name = function(fabric_id){
      var name = vm.data.lookup("fabrics", "id", fabric_id, "name");
      var id = vm.data.lookup("fabrics", "id", fabric_id, "display_id");
      var ret = "";
      if(vm.data.lookup("fabrics", "id", fabric_id, "deleted_at"))
        ret+="(deleted) ";
      ret+=name;
      if (id) ret+=" - "+id;
      return ret;
    };
    
	var dataParameter = {
		"amount_money": {
			"amount" : "100",
			"currency_code" : "USD"
		},
		"callback_url" : "https://requestb.in/17ok6gh1", // Replace this value with your application's callback URL
		"client_id" : "sq0idp-Ix0BKq70y9xTbYuMuBPZkQ", // Replace this value with your application's ID
		"version": "1.3",
		"notes": "Payment for Order #"+vm.order.id,
		"options" : {
			"supported_tender_types" : ["CREDIT_CARD","CASH","OTHER","SQUARE_GIFT_CARD","CARD_ON_FILE"]
		}
	};

  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	var timestamp = Math.floor(Date.now() / 1000);
  vm.squareLink = iOS ? "square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(dataParameter)) +"&time="+timestamp : false;

  
  vm.sendInvoice = function(){
    api.call('sendInvoice', vm.order.id, function(){
      SweetAlert.swal("Your Invoice has been sent!", "An invoice has been sent to "+vm.orderUser.email, "success");
		});
  };
  
  
  
}]);
