
(function() {

  angular
    .module('api', [])
    .service('api', api);
		
	api.$inject = ['$http', '$q', '$rootScope', '$window'];

  function api($http, $q, $rootScope, $window) {

		/*
		* SETUP
		*/
		
		var config = {
			client_id:2,
			client_secret: "8xHu3MLzZXr3pcUneGCM08XOzMc5rH5AOtJSCdIP",
			url :  "http://ec2-54-200-231-145.us-west-2.compute.amazonaws.com",
			headers: {'Content-Type':'application/form-data; charset=UTF-8'}
			
		};
		
		//Call an API function and handle data
		var call = function(func, data, success, error){
			
			accessToken = $window.localStorage.getItem('bdAccessToken');
			
			if (!accessToken){
				var message = "Request being made with no access token.";
				var err = new Error(message);
				throw err;
				if (error) error(err);
				return false;
			}

			this[func](data)
			.success(function(result){
				if (success) success(result);
				$rootScope.$$phase || $rootScope.$apply();
			})
			.error(function(err, status, headers) {
				console.log(err.message);
				if (error) error(err);
			});
			
		}
		
				
		//Build HTTP Request
	  var httpReq = function(method, path, data){
		
		  var headers=config.headers;
		  headers.Authorization = "Bearer "+$window.localStorage.getItem('bdAccessToken');
		  
			var httpConfig = {
				"method": method,
				"url" : config.url+path,
				"headers" : headers
			}	
		  return $http(httpConfig, data);
		}
		

		/*
		* AUTH
		*/
	  var login = function(username, password){
		  postData = {
			  "username":username,
			  "password":password,
			  "scope":"",
			  "grant_type":"password",
			  "client_id":config.client_id,
			  "client_secret":config.client_secret
			}
			return $http.post(config.url+"/oauth/token", postData);
		};
	  
	  
		var getCurrentUser = function(){
			return httpReq("GET", "/api/users/current");
		}
	  
	  
	  
	  
	  /*
		*  JEANS
		*/
	  var getJeans = function(data){
		  var path = "/api/jeans/";
		  if (data.id) path+= data.id;
		  return $http.get(config.url+path);
	  }
	  
	  var createJeans = function(data){
		  var path = "/api/jeans/create";
	  }
	  
	  
	  
	  
	  
	  
	  

		
		
    return {
      call : call,
      login: login,
      getCurrentUser:getCurrentUser
    };
    
  }

})();