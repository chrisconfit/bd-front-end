'use strict';

angular.module('inspinia')
  .controller('UserChoiceController', ['$scope', '$uibModalInstance', 'orderUser', 'choose', 'api',
  function ($scope, $uibModalInstance, orderUser, choose, api) {
		$scope.users=[];
		$scope.showCreate=false;
		$scope.orderUser = orderUser;
		
		$scope.searchClient="";
		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		};
		
		$scope.totalClients = 9999;
		
		function pullUsers(filters, callback){
			api.call('usersList', filters, function(result){
				$scope.clients.push.apply($scope.clients, result.results);
				$scope.totalClients = result.total;
				if (callback) callback();
			});
		};
		
		$scope.clients = [];
		$scope.filters = {
			"results_per_page" : 100,
			"page": 1, 
			"orderby":"last_name",
			"order":"ASC",
		};
		
		pullUsers($scope.filters);    
		
		$scope.getMoreUsers = function(){
			$scope.filters.page++;
			pullUsers($scope.filters);
		};
		
		$scope.filterSearch = function(){
			$scope.clients=[];
			$scope.filters.page = 1;
			pullUsers($scope.filters);
		};

		$scope.chooseClient = function (client) {
			choose(client);
			$uibModalInstance.close();
    };
		
		//Create Client Form
		var defaultClientForm = {		
			"first_name":"",
			"last_name":"",
			"create_addresses":[
				{
					"address_line_1":"",
					"address_line_2":"",
					"city":"",
					"state":"",
					"zip":"",
				}
			],
			"state":"",
			"zip":"",
		}
		$scope.clientForm = angular.copy(defaultClientForm);
		
		$scope.showCreateForm = function(){
			$scope.showCreate=true;
		}
		
		$scope.cancelCreateForm = function(){
			$scope.showCreate=false;
			$scope.clientForm = angular.copy(defaultClientForm);	
		}
		
		$scope.postCreateForm = function(){
			api.call('usersPost', $scope.clientForm, function(result){
				console.log(result);
				console.log("we did it!!!");
				$scope.chooseClient(result);
			});
		}

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

}]);