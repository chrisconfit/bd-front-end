
(function() {

  angular
    .module('bdApp')
    .service('Nuser', Nuser);
		
	Nuser.$inject = ['$location', '$window', 'api'];
  function Nuser($location, $window, api) {
	  
	  var user = {};
	  
		var isLoggedIn = function(){
			console.log("Here");
			return $window.localStorage.getItem("bdAccessToken") ? true : false;
		}
	  
		var set = function(key, data){
			
			if (key == null) return false;
			
			if (typeof key === 'object'){
				
				console.log('setting whole user');
				var userData = key;
				for (obKey in userData){
        if(!userData.hasOwnProperty(obKey)) continue;
					user[obKey] = key[obKey]
    		}					
			}
			
			else user[key] = data; 
      return user;
    };
		
		var setup = function(){
			api.call('getCurrentUser', {}, function(userDetails){
				console.log(userDetails);
				set(userDetails);
				console.log(user);
			});
		}
		
		var login = function(username, password, success, error){
			api.login(username, password)
			.success(function(response){
				console.log(response);
				$window.localStorage.setItem("bdAccessToken", response.access_token);
				if (success) success(response);
			})
			.error(function(err){
				console.log(err);
				if(error) error(err);
			})
		}
		
		var logout = function(){
			$window.localStorage.removeItem("bdAccessToken");
			user = {};
			console.log("logged out");
			$location.path("/login");
		}
	  
	  return {
      get:function(){ return user;},
      isLoggedIn : isLoggedIn,
      set: set,
      login:login,
      logout:logout,
      setup: setup
    };
    
  }

})();