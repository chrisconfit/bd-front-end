(function () {

  angular.module('bdApp', ['ngRoute', 'ngAnimate','ngSanitize', 'ngCookies', 'angular-gestures', 'user', 'api', 'sqPaymentForm']);
  


  function config ($routeProvider, $locationProvider) {
    
    var apiData = ['api', '$q', function(api, $q){
      var data = api.getData();
      if(data.loaded) return data;
      else{
        var defer = $q.defer();
        api.getAppData(function(result){
          defer.resolve(result);
        });
        return defer.promise;
      }
    }];
    
    $routeProvider
      .when('/', {
        templateUrl: '/pages/home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm',
      })
      .when('/pay/:orderDetails', {
        templateUrl: '/pages/pay/pay.view.html',
        controller: 'payCtrl',
        controllerAs: 'vm',
        resolve:{apiData:apiData}
      })
      .when('/fitmatch/:orderDetails', {
        templateUrl: '/pages/fitmatch/fitmatch.view.html',
        controller: 'fmCtrl',
        controllerAs: 'vm',
        resolve:{apiData:apiData}
      })
      .when('/thank-you/:type', {
        templateUrl: '/pages/thank-you/thank-you.view.html',
        controller: 'tyCtrl',
        controllerAs: 'vm',
      })
      .when('/register', {
        templateUrl: '/pages/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/pages/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/customer-register/:email?', {
        templateUrl: '/pages/auth/customer-register/customer-register.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/closet', {
        templateUrl: '/pages/closet/closet.view.html',
        controller: 'closetCtrl',
        controllerAs: 'vm',
        resolve:{apiData:apiData}
      })
      .when('/order/:dataId?/:action?', {
        templateUrl: '/pages/order/order.view.html',
        controller: 'orderCtrl',
        controllerAs: 'vm',
        resolve:{apiData:apiData}
      })
      .when('/customizer/:jeanId?/:action?', {
        templateUrl: '/pages/customizer/customizer.view.html',
        controller: 'customizerCtrl',
        controllerAs: 'vm',
        resolve:{apiData:apiData}
      })
      .when('/admin', {
        templateUrl: '/pages/admin/admin.view.html',
        controller: 'adminCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
    
  }

  function run($rootScope, $location, user) {
	  if (user.isLoggedIn()) user.setup();
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
			
	    var locked = [
		    '/closet',
		    '/order'
	    ];
  		var lockedPage = false;
	    for(var i=0; i<locked.length; i++){
	    	if ($location.path().includes(locked[i]))
	    		lockedPage = true;
			}
   
			if (lockedPage && !user.isLoggedIn() ){
				$location.path('/login');
			}
	  	/* TODO
	  	//If there's no jean on the order screen.... redirect to the customizer page.
	  	if($location.path().indexOf("/order") >= 0 && !Object.keys(jean.data).length){
		  	$location.path('/customizer');
		  };
		  */
		  
    });
  }
	

	angular.module('bdApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'user', run])
		.filter('spaceless',function() {
	    return function(input) {
	      if (input) {
	      	return input.replace(/\s+/g, '-');    
	      }
	    }
		})
		.filter('scoreToSpace',function() {
	    return function(input) {
	      if (input) {
		      var input = input.replace( /([A-Z])/g, " $1" );
	      	return input.replace(/_+/g, ' ');    
	      }
	    }
		})
		.filter('minMax',function(min, max, key) {
			return function(input){
				if (min && input[key] < min) return false;
				if (max && input[key] > max) return false;
		    return true;
		  }  
		})
		.filter('displayName',function() {
			return function(input){	
				ret = input.gender ? input.gender : input.name;			
				return ret ? ret.replace(/Raw Denim/g, "") : false;
		  }  
		});
  
  
  window.onload=function() {
    var body = document.getElementById('bdApp');
    angular.bootstrap(angular.element(body), ['bdApp']);
  }
		/*
	
	// Get Angular's $http module.
	var initInjector = angular.injector(['ng']);
	var $http = initInjector.get('$http');
 
  
	
	$http.get("https://api.bluedeltajeans.com/api/data").then(function(result){

		result.data.lookup = function(data, key, value, retKey){
			var dataSet = this[data];
			retKey = retKey || false;
			for (i=0; i<dataSet.length; i++){				
				if(dataSet[i][key] == value)
					return retKey ? dataSet[i][retKey] : dataSet[i]
			}
		}
		
		angular.module('bdApp').constant('apiData', result.data);
		var body = document.getElementById('bdApp');
		angular.bootstrap(angular.element(body), ['bdApp']);		
	});
	

	
*/
		
		
	
		
})();