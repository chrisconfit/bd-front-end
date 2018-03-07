'use strict';

angular.module('inspinia')
  .controller('ClientsEditController',  ['user', '$uibModal', 'userData', '$scope', 'api', 'SweetAlert', 'toaster', '$state', '$location',
  function (user, $uibModal, userData, $scope, api, SweetAlert, toaster, $state, $location) {
    
    var vm = this;
    
    //Setup
		vm.userData = userData;
    vm.cardsSearched=false;
		if(vm.userData.square_id){
			api.call('usersGetUserCreditCards', vm.userData.id, function(data){
				vm.userData.cards = data;
				vm.cardsSearched=true;
			}, function(err){
        vm.cardsSearched=true;
			});
		}else{
      vm.cardsSearched=true;
      vm.userData.cards=[];
		}
		vm.appData = api.getData();
		
		var defaultUser = {
			first_name:"",
			last_name:"",
			role_id:1,
			email:"",
			phone:"",
			addresses:[],
		};

		vm.newUser = !vm.userData.id;

		vm.userData = vm.newUser ? defaultUser : userData;		
		vm.originalUser = vm.newUser ? null : angular.copy(userData);
		vm.clientEditMode= vm.newUser ? true : false;
		
		vm.beginClientEdit = function(){
			vm.clientEditMode = true;
		};
		
		vm.clearClientEdit = function(item){
			vm.clientEditMode = false;
			item = vm.originalUser;
		};
	
		vm.editAddress = function (type, icon) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/address-choice/address.html',
        controller: 'AddressController',
        resolve: {
	        data: {
		        addressType : type,
		        icon : icon,
		      },
	        save : function(){
		        return vm.saveAddress;
	        },
          address: function () {
            return vm.userData.addresses;
          },
          order : function() {
	          return {};
          }
        }
    	});
    };
    
    function setPrimary(primaryId){
	    for (var i=0; i<vm.userData.addresses.length; i++){
		  	var thisAdd = vm.userData.addresses[i];
		  	if (thisAdd.id == primaryId) thisAdd.primary=1;
		  	else thisAdd.primary=0;
	    }
    }
    
    function hasProp (obj, prop) {
			return Object.prototype.hasOwnProperty.call(obj, prop);
		}


	  vm.saveAddress = function(add, callback){	
			var creatingNew = true;
			if (add === parseInt(add, 10)){
				creatingNew = false;
				for (var i=0; i<vm.userData.addresses.length; i++){
		  		var thisAdd = vm.userData.addresses[i];
					if (thisAdd.id == add) add = thisAdd;
					else thisAdd.primary=false;
	    	}
	    }
			add.primary=1;
			var data = {userId:vm.userData.id, address:add};

			api.call('postAddress', data, function(result){	
				if(creatingNew) vm.userData.addresses.push(result);
        setPrimary(result.id);
				if(callback)callback();
			});
		};
		
		
		
	
	
  
		/*														*\
		*															*
		*															*
		* * * * * Save/Create	* * * * * 
		*															*	
		\*	  												*/
		vm.createCreditCard = function(nonce){
			api.call('usersCreateCreditCard', {userId:vm.userData.id, nonce:nonce}, function(result){
				result.card.brand = result.card.card_brand;
				vm.userData.cards.push(result.card);
			});
		};

		vm.availableRoles = [
			{id:1, name:'Client'}, 
			{id:2, name:'Admin'}
		];	
	
		vm.user=user.get(true);
		$scope.$watch(angular.bind(this, function () {
		  return this.user;
		}), function (newVal) {
			if(newVal.role_id>2)
				vm.availableRoles.push({id:3, name:'Super Admin'});
		});
	
		
		function checkForAddress(){			
			//Address has not been touched
			if (!vm.userData.create_addresses) return false;
			var add = vm.userData.create_addresses[0];
			if(!add.address_line_1 && !add.address_line_1 && !add.city && !add.state && !add.zip){
				delete vm.userData.create_addresses;
				return false;
			}
			return true;
		}
		
		
		vm.useAddress = false;

		vm.saveUser = function(){

			checkForAddress();
			if (!$scope.userDataForm.$valid){
				$scope.userDataForm.submitted = true;
				return false;
			}  

			toaster.pop({
			  type: 'wait',
			  title: "Saving...",
			  showCloseButton: true,
			  timeout: 3000
			});
				
			var args = vm.userData;
			var succMessage = vm.newUser ? "User Created" : "User Saved";
			var errMessage = vm.newUser ? "Could not create user" : "Could not Save user";	
			
			
			api.call('usersPost', args, function(result){
				vm.clientEditMode=false
				toaster.pop({
				  type: 'success',
				  title: succMessage,
				  showCloseButton: true,
				  timeout: 3000
				});
				
				if(vm.newUser) $state.transitionTo('clients.edit', {clientId:result.id});
						
			}, function(err){
				toaster.pop({
				  type: 'error',
				  title: errMessage,
				  body: err.message,
				  showCloseButton: true,
				  timeout: 7000
				});
			});

		}

		vm.states = [
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
		]
  
  
    vm.viewUserOrders = function(id){
			$location.url('/orders/list?user_id='+id);
      //$state.go('orders.list', {user_id:id, results_per_page:10});
    };
		
  }]);
