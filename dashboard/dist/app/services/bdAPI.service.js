
(function() {

  angular
    .module('inspinia')
    .service('bdAPI', bdAPI);

  bdAPI.$inject = ['$window', '$http', '$httpParamSerializer', '$filter','$q', 'aws'];
  function bdAPI ($window, $http, $httpParamSerializer, $filter, $q, aws) {

	  $window._thirdParty = $window._thirdParty || {};
	  $window._thirdParty.BlueDeltaApi =new API.Client.DefaultApi(angular.injector(["ng"]).get("$http"),
    angular.injector(["ng"]).get("$httpParamSerializer"),
    angular.injector(["ng"]));

    var BlueDeltaApi = $window._thirdParty.BlueDeltaApi;
		
		
		
		BlueDeltaApi.jeanKeyToDataKey = function(jeanKey){
			var dataKey = false;
			
			switch(true){
				case jeanKey.indexOf('thread') > -1:
				dataKey = "threads";
				break;
				
				case (jeanKey == "gender" || jeanKey == "style" ||  jeanKey == "fabric"):
				dataKey = jeanKey+"s";
				break;
				
			}
			return  dataKey;
		}
			
				
		BlueDeltaApi.dataLookup = function(dataKey, id, attr){
			
			attr = attr||null;
	
			if (typeof dataKey == 'undefined' || typeof id == 'undefined') return false;
			var dataSet = BlueDeltaApi.jsonData[dataKey];
			dataById = 	$filter('filter')(dataSet, {id: id});
			if (typeof dataById == 'undefined') return false; //Return false when dataSet is undefined...
			
			selected = dataById[0];
			
			if (!attr) return selected;
			else return selected[attr];	
			
		}

		var cleanUser = function(user){
			var temp = JSON.stringify(user);
			temp = temp.replace(/\"\"/g, null);
			user = JSON.parse(temp);
			return user;
		}
				
				
		BlueDeltaApi.setupHeaders = function(){
			var userData = aws.getCurrentUserFromLocalStorage();
			this.defaultHeaders_['Authorization'] = userData.idToken.getJwtToken();
			var idTokenPayload = userData.idToken.jwtToken.split('.')[1];
			var identityID = JSON.parse(atob(idTokenPayload)).sub;	
			return identityID;
		}
		
		BlueDeltaApi.call = function(func,args,success,error){
			console.log(func);
			console.log(args);
			var bdapi = this;
	    aws.getCurrentUserFromLocalStorage(function(session){
		    //Reset auth header
				bdapi.defaultHeaders_['Authorization'] = session.idToken.getJwtToken();
				
				//put args into array form
				if (!Array.isArray(args)) args = [args];
				
				bdapi[func].apply(bdapi, args).then(function(result){
					success(result);
				}, function(err){
					console.log(err);
					if (error) error(err);
				});
	    });
		}

		//Save User
		BlueDeltaApi.saveUser = function(user){
			var defer = $q.defer();
			user = cleanUser(user);
			if (!user.identityId) defer.reject("No identity Id");
			else{
				BlueDeltaApi.usersUpdate(user.identityId, user).then(
					function(result){
						console.log("got it");
						defer.resolve(result);
					},
					function(err){
						console.log("Error saving user:");
						console.log(err);
						defer.reject(err);
					}	
				)
			}
			return defer.promise;	
		}

	  return BlueDeltaApi;
  }

})();