
(function() {

  angular
    .module('user', ['api'])
    .service('user', user);

  user.$inject = ['$location', '$window', 'api'];
  function user($location, $window, api) {

		var isCustomizer = ($location.$$host=="localhost" && $location.$$port == 4000) || $location.$$host.split('.')[0]=="build";
		var userRoleProp = isCustomizer ? "bdUserRole" : "bdDashUserRole";
		if($location.$$host=="localhost") userRoleProp += "_dev";
		var tokenProp = isCustomizer ? "bdAccessToken":"bdDashAccessToken";
    if($location.$$host=="localhost") tokenProp += "_dev";
		var idProp = isCustomizer ? "bdUserId":"bdDashUserId";
    if($location.$$host=="localhost") idProp += "_dev";
		var user = {};


	  var isAdmin = function(){
	  	return parseInt($window.localStorage.getItem(userRoleProp)) > 1;
	  };

		var isLoggedIn = function(){ return !!$window.localStorage.getItem(tokenProp); };
	  var getToken = function(){ return $window.localStorage.getItem(tokenProp); };
			
		var set = function(key, data){
			
			if (key == null) return false;
			
			if (typeof key === 'object'){
				var userData = key;
				for (obKey in userData){
        if(!userData.hasOwnProperty(obKey)) continue;
					user[obKey] = key[obKey]
    		}					
			}
			
			else user[key] = data; 
      return user;
    };
		
		var setup = function(callback){
   
			api.call('getCurrentUser', {}, function(userDetails){
				//console.log("get current user");
				//console.log(userDetails);
				//console.log("setting "+userRoleProp);
				$window.localStorage.setItem(userRoleProp, userDetails.role_id);
				set(userDetails);
				if (callback) callback(userDetails);
			});
		};
		
		function authCallback(response, callback){
			//console.log("Auth callback");
			//console.log(response);//
			//console.log("setting token to "+tokenProp);
			$window.localStorage.setItem(tokenProp, response.access_token);
			setup(function(userData){	
				$window.localStorage.setItem(userRoleProp, userData.role_id);		
				$window.localStorage.setItem(idProp, userData.id);
				if (callback) callback(userData);
			});
		}
		
		var login = function(username, password, success, error){
			var userData =  {
				username:username, 
				password:password
			}
			api.call('login', userData, function(response){
				authCallback(response, success);
			}, function(err){
				if(error) error(err);
			});
		}
		
		var register = function(username, password, first_name, last_name, success, error){
			
			var userData = {
				email:username,
				password:password,
				first_name:first_name,
				last_name:last_name
			};
			
			api.call('register', userData, function(response){
				authCallback(response, success);
			}, function(err){
				if(error) error(err);
			});		
		}
		
		var getResetToken = function(email, success, error){
			api.call('getResetToken', email, function(response){
				success(response);
			}, function(err){
				if(error) error(err);
			});		
		}
		
		var resetPassword = function(data, success, error){
			api.call('resetPassword', data, function(response){
				success(response);
			}, function(err){
				if(error) error(err);
			});		
		}
		
		var logout = function(callback, redirect){
			$window.localStorage.removeItem(tokenProp);
			$window.localStorage.removeItem(userRoleProp);
			$window.localStorage.removeItem(idProp);
			user = {};
			if(callback) callback();
			if(redirect !== false) $location.path("/login");
		}
		
		var update = function(userData, success, error){
			api.call('updateMe', userData, success, error);
		}
	  var jeans = [];
	  var getMyJeans = function(){
		  
	  }
	  return {
      get:function(){ return user;},
      isLoggedIn : isLoggedIn,
      isAdmin : isAdmin,
      set: set,
      login:login,
      register:register,
      update: update,
      logout:logout,
      setup: setup,
      getToken: getToken,
      getResetToken:getResetToken,
      resetPassword:resetPassword
    };

	}
	
})();
