(function () {

  angular
    .module('bdApp')
    .controller('addressChoiceCtrl', addressChoiceCtrl);

  addressChoiceCtrl.$inject = ['$scope', '$filter', 'messages', 'api', 'user'];
  
  function addressChoiceCtrl($scope, $filter, messages, api, user) {
	  
	  $scope.editing=false;
	  $scope.active=false;
		$scope.addForm = {};
		$scope.model = {};
		$scope.user = user.get();
		var addFormFields = ['address_line_1','address_line_2','city','state','zip'];
		
		
		//Choose Primary Address
		$scope.choosePrimary = function(address){
			for (a = 0; a< $scope.user.addresses.length; a++){
				var add = $scope.user.addresses[a];
				add.primary = (add.id == address.id ? 1:0);
			}
			api.call('postMyAddress', address);
			$scope.addressObject = address;
		}
				
		$scope.startEditing = function(){
			//Bring Primary address to the top
			$scope.user.addresses = $filter('orderBy')($scope.user.addresses, '-primary');
			$scope.editing = true;
		}
		
		$scope.stopEditing = function(){
			$scope.editing = false;
		}

		$scope.editAdd = {};
		
		//Open Address Form
		$scope.open = function(index){

			$scope.active = true;
			if (!$scope.user.addresses) $scope.user.addresses = [];
			
			//New Address
			if (typeof index === 'undefined'){
				$scope.model = {};
				$scope.editAdd.data = null;	
			}
			
			//Editing Existing...
			else{
				$scope.model = $scope.user.addresses[index];
				$scope.editAdd.index = index;
				$scope.editAdd.data =  angular.copy($scope.model);
			}
						
		}
		

		function resetForm(close){
			close = close || true;
			$scope.editAdd = {};
			$scope.model = {};
			if (close) $scope.active = false;
		}

		//Clear Address Form
		$scope.clear = function(){
			var dataObj = $scope.editAdd.data;
			if (dataObj !== null) $scope.user.addresses[$scope.editAdd.index] = $scope.editAdd.data;//Reset Address
			resetForm();			
		}
		
		function findAddressbyKey(key, value){
			var primary = $scope.user.addresses.filter(function (add) {
			   return (add[key] == value);
			});
			return primary[0];
		}
		
		
		//Remove Address and save user
		$scope.remove = function(addressId){
			//Don't allow user to delete their last address..
			if ($scope.user.addresses.length < 2){
				messages.set("You can't remove your last address", "error");
				return false;	
			}
			api.call('deleteMyAddress', addressId, function(result){
				//Remove deleted address...
				for(i=0; i<$scope.user.addresses.length; i++){
					var add = $scope.user.addresses[i];
					if (add.id == addressId) $scope.user.addresses.splice(i,1);
				}
				//Change to new primary if primary was delted...
				if(result.new_primary_id){				
					var newPrimary = result.new_primary_id;
					address = findAddressbyKey("id", newPrimary);
					address.primary=1;
				}
			});
		};
		
		//Save Form
		$scope.save = function(){
			var newAdd = $scope.model.id ? false : true;
			console.log($scope.model);
			if(newAdd) {
        $scope.model.primary = 1;
        for (a = 0; a < $scope.user.addresses.length; a++) {
          var add = $scope.user.addresses[a];
          add.primary = 0;
        }
      }
			api.call('postMyAddress', $scope.model, function(result){	
				if (newAdd)	$scope.user.addresses.push(result);
				$scope.active = false;
				$scope.model = {};
			});
		};
		
		
		//US States
		$scope.states = [
			{
			  "name": "Alabama",
			  "abbreviation": "AL"
			},
			{
			  "name": "Alaska",
			  "abbreviation": "AK"
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
			  "name": "Florida",
			  "abbreviation": "FL"
			},
			{
			  "name": "Georgia",
			  "abbreviation": "GA"
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
			  "name": "Pennsylvania",
			  "abbreviation": "PA"
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
    
		
			  
	}
	
})();
		