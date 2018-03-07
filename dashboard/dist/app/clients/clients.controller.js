'use strict';

angular.module('inspinia')
  .controller('ClientsController',  ['$scope', 'SweetAlert', 'api', function ($scope, SweetAlert, api) {
    var vm = this;
		var deleteUserBox = {
      title: "Are you sure?",
      text: "This user will be deleted forever!",
      type: "warning",
      showCancelButton: true,
			confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false,
      closeOnCancel: true 
    };
  	
    
		vm.deleteUser = function(userId){
			SweetAlert.swal(deleteUserBox,
		    function (isConfirm) {
	        if (isConfirm) {
		        api.call('usersDelete', userId, function(result){
			        console.log(result);
							vm.usersRemove(userId);
	          	SweetAlert.swal("Deleted!", "User "+userId+" has been deleted.", "success");
	          });
	        }
		    }
		  );
		};

		vm.usersRemove = function(userId){
			for(var i=0; i<vm.users.length; i++){
				if (vm.users[i].id == userId){
					vm.users.splice(i, 1);
					return;
				}
			}
		};
		
    
  		
		
		
		
		
		
		
		vm.changePage = function(page){
			console.log("new page: "+page);
			vm.filters.page=parseInt(page);
			vm.users=[];
			pullUsers(vm.filters);
		}
		
		vm.pagination = {
			total:0,
			current:0
		}
		
		function pullUsers(filters, callback){
			//var data = vm.pagination.nextURL ? [vm.pagination.usersPerPage, vm.pagination.nextURL] : vm.pagination.usersPerPage;
			api.call('usersList', filters, function(result){
				if (vm.pagination.total == 0 ) vm.pagination.total = Math.ceil(parseInt(result.total)/vm.filters.results_per_page);
				vm.pagination.current = parseInt(result.page);
				vm.users.push.apply(vm.users, result.results);
				vm.pagination.loaded++;	
				if (callback) callback();
			});
		}
		
		//Init users
		vm.users = [];
		vm.filters = {
			"results_per_page" : 25,
			"page": 1, 
			"orderby":"last_name",
			"order":"ASC",
		}
		$scope.$watch(angular.bind(this, function () {
		  return this.filters.state;
		}), function (newVal) {
			if (newVal =="") delete vm.filters.state;
			if (!newVal) return false;	
		});
		
		pullUsers(vm.filters);    
    
    vm.changeSort = function(col, asc){
	    var direction = asc ? "ASC" : "DESC";
	    vm.filters.orderby=col;
	    vm.filters.order = direction;
			vm.newQuery();
    };
        
    vm.newQuery = function(){
	    vm.pagination.total=0;
	    vm.users = [];
	    vm.filters.page=1;
	    for (var i=0; i<vm.filters.length; i++){
		    if (vm.filters[i] == "") delete vm.filters[i];
	    }
	    pullUsers(vm.filters);
    };


		

    vm.states = [
	    {
		    "name":"None",
		    "abbreviation":""
	    },
	    {
	        "name": "Alabama",
	        "abbreviation": "AL"
	    },
	    {
	        "name": "Alaska",
	        "abbreviation": "AK"
	    },
	    {
	        "name": "American Samoa",
	        "abbreviation": "AS"
	    },
	    {
	        "name": "Arizona",
	        "abbreviation": "AZ"
	    },
	    {
	        "name": "Arkansas",
	        "abbreviation": "AR"
	    },
	    {
	        "name": "California",
	        "abbreviation": "CA"
	    },
	    {
	        "name": "Colorado",
	        "abbreviation": "CO"
	    },
	    {
	        "name": "Connecticut",
	        "abbreviation": "CT"
	    },
	    {
	        "name": "Delaware",
	        "abbreviation": "DE"
	    },
	    {
	        "name": "District Of Columbia",
	        "abbreviation": "DC"
	    },
	    {
	        "name": "Federated States Of Micronesia",
	        "abbreviation": "FM"
	    },
	    {
	        "name": "Florida",
	        "abbreviation": "FL"
	    },
	    {
	        "name": "Georgia",
	        "abbreviation": "GA"
	    },
	    {
	        "name": "Guam",
	        "abbreviation": "GU"
	    },
	    {
	        "name": "Hawaii",
	        "abbreviation": "HI"
	    },
	    {
	        "name": "Idaho",
	        "abbreviation": "ID"
	    },
	    {
	        "name": "Illinois",
	        "abbreviation": "IL"
	    },
	    {
	        "name": "Indiana",
	        "abbreviation": "IN"
	    },
	    {
	        "name": "Iowa",
	        "abbreviation": "IA"
	    },
	    {
	        "name": "Kansas",
	        "abbreviation": "KS"
	    },
	    {
	        "name": "Kentucky",
	        "abbreviation": "KY"
	    },
	    {
	        "name": "Louisiana",
	        "abbreviation": "LA"
	    },
	    {
	        "name": "Maine",
	        "abbreviation": "ME"
	    },
	    {
	        "name": "Marshall Islands",
	        "abbreviation": "MH"
	    },
	    {
	        "name": "Maryland",
	        "abbreviation": "MD"
	    },
	    {
	        "name": "Massachusetts",
	        "abbreviation": "MA"
	    },
	    {
	        "name": "Michigan",
	        "abbreviation": "MI"
	    },
	    {
	        "name": "Minnesota",
	        "abbreviation": "MN"
	    },
	    {
	        "name": "Mississippi",
	        "abbreviation": "MS"
	    },
	    {
	        "name": "Missouri",
	        "abbreviation": "MO"
	    },
	    {
	        "name": "Montana",
	        "abbreviation": "MT"
	    },
	    {
	        "name": "Nebraska",
	        "abbreviation": "NE"
	    },
	    {
	        "name": "Nevada",
	        "abbreviation": "NV"
	    },
	    {
	        "name": "New Hampshire",
	        "abbreviation": "NH"
	    },
	    {
	        "name": "New Jersey",
	        "abbreviation": "NJ"
	    },
	    {
	        "name": "New Mexico",
	        "abbreviation": "NM"
	    },
	    {
	        "name": "New York",
	        "abbreviation": "NY"
	    },
	    {
	        "name": "North Carolina",
	        "abbreviation": "NC"
	    },
	    {
	        "name": "North Dakota",
	        "abbreviation": "ND"
	    },
	    {
	        "name": "Northern Mariana Islands",
	        "abbreviation": "MP"
	    },
	    {
	        "name": "Ohio",
	        "abbreviation": "OH"
	    },
	    {
	        "name": "Oklahoma",
	        "abbreviation": "OK"
	    },
	    {
	        "name": "Oregon",
	        "abbreviation": "OR"
	    },
	    {
	        "name": "Palau",
	        "abbreviation": "PW"
	    },
	    {
	        "name": "Pennsylvania",
	        "abbreviation": "PA"
	    },
	    {
	        "name": "Puerto Rico",
	        "abbreviation": "PR"
	    },
	    {
	        "name": "Rhode Island",
	        "abbreviation": "RI"
	    },
	    {
	        "name": "South Carolina",
	        "abbreviation": "SC"
	    },
	    {
	        "name": "South Dakota",
	        "abbreviation": "SD"
	    },
	    {
	        "name": "Tennessee",
	        "abbreviation": "TN"
	    },
	    {
	        "name": "Texas",
	        "abbreviation": "TX"
	    },
	    {
	        "name": "Utah",
	        "abbreviation": "UT"
	    },
	    {
	        "name": "Vermont",
	        "abbreviation": "VT"
	    },
	    {
	        "name": "Virgin Islands",
	        "abbreviation": "VI"
	    },
	    {
	        "name": "Virginia",
	        "abbreviation": "VA"
	    },
	    {
	        "name": "Washington",
	        "abbreviation": "WA"
	    },
	    {
	        "name": "West Virginia",
	        "abbreviation": "WV"
	    },
	    {
	        "name": "Wisconsin",
	        "abbreviation": "WI"
	    },
	    {
	        "name": "Wyoming",
	        "abbreviation": "WY"
	    }
		];
  }]);
