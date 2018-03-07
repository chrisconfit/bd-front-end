'use strict';

angular.module('inspinia')
  .controller('OrdersController', ['$location', '$filter','$scope', 'SweetAlert', 'user', 'api', '$stateParams', function ($location, $filter, $scope, SweetAlert, user, api, $stateParams) {

    var vm = this;
    vm.data = api.getData();
    vm.user = user.get(true);
    
    function serializeFilters(obj){
	    var result = [];
			for (var property in obj)
				if(!obj[property] || obj[property]=="All" || obj[property]==null || obj[property] =="") continue;
        else result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
			return result.join("&");
    }

    vm.filterOrders = function(){
	    var filters = angular.copy(vm.filters);
	    var range = filters.dateRange;
	    delete filters.dateRange;
	    filters.startDate = range.startDate;
	    filters.endDate = range.endDate;
    };

    
    //Delete Orders
    
    var deleteOrderBox = {
      title: "Are you sure?",
      text: "This order will be deleted forever!",
      type: "warning",
      showCancelButton: true,
			confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false,
      closeOnCancel: true 
    };
    
		vm.deleteOrder = function(orderId){
			SweetAlert.swal(deleteOrderBox,
		    function (isConfirm) {
	        if (isConfirm) {
						api.call('ordersDelete', orderId, function(result){
							vm.ordersRemove(orderId);
	          	SweetAlert.swal("Deleted!", "Order# "+orderId+" has been deleted.", "success");
	          });
	        }
		    }
		  );
		};
		
		vm.ordersRemove = function(orderId){
			for(var i=0; i<vm.orders.length; i++){
				if (vm.orders[i].id == orderId){
					vm.orders.splice(i, 1);
					return;
				}
			}
		};
 
 
	
		//Get orders
		vm.pagination = {
			ordersPerPage:20,
			prev:false,
			next:false,
			nextURL:"",
			page:1,
			loaded:0
		};
		vm.pagination.startIndex = (vm.pagination.page-1)*vm.pagination.ordersPerPage;
		
		vm.findIndex = function(orderId){
	    for(var i = 0; i < vm.orders.length; i++) {
	      if(vm.orders[i].orderId === orderId) return i;
	    }
	    return -1;
		};
		
		function incrementPage(inc){
			vm.pagination.page = vm.pagination.page+inc;
			vm.pagination.startIndex = (vm.pagination.page-1)*vm.pagination.ordersPerPage;
			if (inc > 0) vm.pagination.prev=true;
			else vm.pagination.next=true;
		}
		
		
		vm.pagination.changePage = function(dir){
			
			if (vm.pagination.page == 1 && dir=="prev") return false;
			if (vm.pagination.page == 2 && dir=="prev") vm.pagination.prev=false;
			
			//put in rules for the last page
			
			if (dir =="next"){
				if (vm.pagination.page < vm.pagination.loaded) incrementPage(1);
				else{
					pullOrders(function(){
						incrementPage(1);
					})
				}
			}else{
				incrementPage(-1);				
			}	
		};
		
		
		
		function pullOrders(filters, callback){
			api.call('ordersList', filters, function(result){
				if (vm.pagination.total == 0 ) vm.pagination.total = Math.ceil(parseInt(result.total)/vm.filters.results_per_page);
				console.log("result....");
				console.log(result);
				
				vm.pagination.current = parseInt(result.page);
				vm.orders.push.apply(vm.orders, result.results);
				vm.pagination.loaded++;
				vm.filters.page = result.page;
				$location.search(vm.filters);
				if (callback) callback();
			});
		}
		
		//Init users
		vm.orders = [];
		vm.defaultFilters = {
			"results_per_page" : 25,
			"page": 1, 
			"orderby":"created_at",
			"order":"DESC",
		};
		
		vm.filters = angular.copy(vm.defaultFilters);
		console.log($location.search());
    queryToFilters();
    
    if(Object.keys($location.search()).length){
      pullOrders(vm.filters);
		}else{
      $location.search(vm.filters);
		}
		
		function queryToFilters() {
      console.log("QF");
      var queryFilters = $location.search();
      console.log(queryFilters);
			//Add filters to vm.filters from url
      for (var filter in queryFilters) {
        if (queryFilters.hasOwnProperty(filter)) {
        	var value = queryFilters[filter];
          value = !isNaN(value) ?  parseInt(value) : value;
          vm.filters[filter] = value;
        }
      }
      //Clean up removed filters
			
      for (var filter in vm.filters) {
        if (vm.filters.hasOwnProperty(filter)) {
        	if(!queryFilters[filter]){
        		
        		if(vm.defaultFilters[filter]) vm.filters[filter] = angular.copy(vm.defaultFilters[filter]);
        		else delete vm.filters[filter];
					}
        
        }
      }
    }
    
		

  
    $scope.$on('$locationChangeSuccess', function(a,oldUrl, newUrl) {
    	console.log("CHANGE SUCC");
    	console.log(oldUrl, newUrl);
			queryToFilters();
    	vm.orders = [];
      pullOrders(vm.filters);
    });
    
    $scope.$watch(angular.bind(this, function () {
		  return this.filters.id;
		}), function (newVal) {
			if (newVal =="") delete vm.filters.id;
			if (!newVal) return false;	
			var arr = Array.isArray(newVal) ? newVal : newVal.split(',');
			vm.filters.id=arr;
		});
		
		
		//Date range filter setter
		vm.dateRange = {startDate: null, endDate: null}
		$scope.$watch(angular.bind(this, function () {
		  return this.dateRange;
		}), function (newVal) {
			if (newVal.startDate ==null) delete vm.filters.start_date;
			else vm.filters.start_date = new Date(newVal.startDate);
			if (newVal.endDate ==null) delete vm.filters.end_date;
			else vm.filters.end_date = new Date(newVal.endDate);
		});    	
		
		vm.changeSort = function(col, asc){
	    var direction = asc ? "ASC" : "DESC";
	    vm.filters.orderby=col;
	    vm.filters.order = direction;
			vm.newQuery();
    };
        
    vm.newQuery = function(){
	    vm.pagination.total = 0;
	    vm.orders = [];
	    vm.filters.page=1;
	    for (var i=0; i<vm.filters.length; i++){
		    if (vm.filters[i] == "") delete vm.filters[i];
	    }
	    $location.search(vm.filters);
	    //pullOrders(vm.filters);
    };
  
    
					
		vm.formatDate = function(date){
			return $filter('date')(new Date(date), "MM/dd/yyyy");
		};

		vm.changePage = function(page){
			vm.filters.page=parseInt(page);
			vm.orders=[];
			$location.search(vm.filters);
		};
		
		vm.pagination = {
			total:0,
			current:0
		};

		
			

  }]);
