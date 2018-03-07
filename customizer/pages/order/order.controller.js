(function() {
  
  angular
    .module('bdApp')
    .controller('orderCtrl', orderCtrl);

  orderCtrl.$inject = ['$window', '$location', 'jean','popups', '$filter', '$routeParams', 'user', 'api', '$scope', 'apiData', '$http'];
  function orderCtrl($window, $location, jean, popups, $filter, $routeParams, user, api, $scope, apiData, $http) {
		
    var vm = this;
    vm.popups=popups.get();
    vm.tailors = apiData.tailors;
		vm.ordersLoaded = false;
		vm.orderForm={};
		vm.orderCreateObj = {}
    vm.editData = {};
    vm.lookup = apiData.lookup;
    
		
		/*
		* SET UP USER
		*/
    vm.user = {};
    vm.user = user.get();
    $scope.$watch('vm.user', function(newV) {
			vm.orderCreateObj.shipping_name = newV.first_name+" "+newV.last_name;
			vm.orderCreateObj.shipping_phone = newV.phone;
			vm.orderCreateObj.shipping_address_id = getPrimaryAddress(newV.addresses);
    }, true);
		
		
		/*
    * SET UP ORDER DATA
    */
    vm.orders = [];
    api.call('getMyOrders', null, function(result){
      vm.orders = result;
      vm.ordersLoaded=true;
    });
    
   	//SET UP A RE-ORDER
		if ($routeParams.dataId && $routeParams.action == 're-order'){
			//Set order type to re-order
			vm.orderCreateObj.order_type_id=5;
      vm.orderCreateObj.comment="Re-Order of Order #"+$routeParams.dataId;
      
      //Set up new order from Id passed through URL
      $scope.$watch('vm.orders', function(orders) {
        if (!orders.length) return false;
        var orderFound = false;
        for(var i=0; i<orders.length; i++){
          if(orders[i].id == $routeParams.dataId){
            var order_from_url = orders[i];
            //Set up new order via re-order...
            vm.jeanData = order_from_url.order_items[0];
            vm.copyItem = order_from_url.order_items[0];
            vm.jeanData.image_url =	vm.jeanData.jean_image_url;
            vm.jeanData.name =	vm.jeanData.jean_name;
            vm.orderCreateObj.reorder_item_id = order_from_url.order_items[0].id;
						orderFound = true;
            break;
          }
        }
        
        //Set Error
        if(!orderFound) vm.orderErr = "Order Not Found!";
      
      }, true);
		}
		
		//SET UP A REGULAR ORDER FROM JEAN ID
		else if ($routeParams.dataId && !$routeParams.action){
			var jeanId = $routeParams.dataId;
			jean.setup(jeanId).then(function(){
				vm.jeanData=jean.get();
				console.log('aftersetup');
				console.log(vm.jeanData);
				vm.orderCreateObj.jean_id = vm.jeanData.id;
				console.log(vm.orderCreateObj);
			});
		}
  
		
		
		
		
		
  
    //UTIL
    function getPrimaryAddress(addresses){
      if(!addresses || !addresses.length) return false;
      for (var i=0; i<addresses.length; i++) {
        if (addresses[i].primary == true) return addresses[i].id;
      }
      return addresses[0].id;
    }
    
		//FRONT END FUNCS
		vm.goToCloset = function(){ $location.path('/closet'); }
		
		vm.startOver = function(){ 
			jean.reset();
			$location.path('/customizer'); 
		};
		vm.placeOrder = function() {
			vm.orderFormErr = false;
			if(!vm.orderCreateObj.shipping_name)
				vm.orderFormErr = "Please enter a shipping name."
      if(!vm.orderCreateObj.shipping_phone)
        vm.orderFormErr = "Please enter a shipping phone number."
      if(!vm.orderCreateObj.order_type_id)
        vm.orderFormErr = "Please choose a fitting option."
      if(!vm.orderCreateObj.shipping_address_id)
        vm.orderFormErr = "Please choose a shipping address."
			
			if(vm.orderFormErr) return false;
			
      api.call('placeMyOrder', vm.orderCreateObj, function (result) {
        vm.popups.orderPlaced = true;
      });
    };

		vm.chooseOrderType = function(type, copyOrder){
			//Set order type
			vm.orderCreateObj.order_type_id=type;
			
			if(copyOrder){
				var copyItem = copyOrder.order_items[0];
				vm.orderCreateObj.fitDate = copyOrder.fit_date;
			}
			
			//Set order_item_copy
			if(type == 4){
				vm.orderCreateObj.copy_order_item_id = copyItem.id;
				vm.copyItem = copyItem;
			}
			else{
				delete vm.orderCreateObj.copy_order_item_id;	
				vm.copyItem = {};
			}
      if(type!==1 || type!==2){
				delete vm.orderCreateObj.tailor_id;
			}
		};
		
		vm.measurementKeys = [
			"waist",
			"seat_down",
			"seat_right",
			"rise",
			"full_rise",
			"thigh_upper_down",
			"thigh_upper_right",
			"thigh_middle_down",
			"thigh_middle_right",
			"thigh_lower_down",
			"thigh_lower_right",
			"outseam",
			"knee_up",
			"knee_right", 
			"calf_up",
			"calf_right",
			"leg_opening"
		];
		
		vm.hasMeasurements = function(order) {

			if (!order || !order.order_items.length ) return false;
			
			var orderItem = order.order_items[0];
			var testCols = [
				'waist'
			];
			var measurements = true;
			for (i=0;i<testCols.length; i++){
				if (orderItem[testCols[i]] == "" || orderItem[testCols[i]] == null){
					measurements = false;
					break;
				}
			}
			
			return measurements;

		};
		
		vm.editField = function(field){
			var editText = vm.orderCreateObj[field] || " ";
			vm.editData[field] = angular.copy(editText);
		};
		
		vm.revertField = function(field){
			vm.orderCreateObj[field] = angular.copy(vm.editData[field]);
			vm.editData[field] = false;	
		};
		
		

  }
  



})();