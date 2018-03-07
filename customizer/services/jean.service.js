
(function() {

  angular
    .module('bdApp')
    .service('jean', ['$routeParams', '$window', '$q', 'api', '$http', jean]);

  function jean($routeParams, $window, $q, api, $http) {


		/*
		*   JSON Data lookup
		*/
		/*
		var dataLookup = function(dataType, key){

			var data = apiData[dataType];
			if (!data) return false;
			
			for (i=0; i<data.length; i++) {
				//	console.log(data[i][dataType+"Id"], key);
				if (data[i][dataType+"Id"] == key) 				
				return data[i];
  		}
		}
		*/

		
		/*
		*  Jean Data
		*/
		
  	var jeanData = {};
  	
		set = function(property, value){
			jeanData[property] = value;
			this.saved=false;
		};
		
		createNew = function(jean){
			if (!jean || jean.constructor != Object){
				jeanData = {
					"gender_option_id" : 1,
					"style_option_id" : 1,
					"fabric_id" : 1704,
					"accent_thread_id" :1,
					"top_thread_id" : 1,
					"bottom_thread_id" : 1
				}
				jeanData.saved = false;
			}else{
				jeanData = {
					"gender_option_id" : jean.gender_option_id,
					"style_option_id" : jean.style_option_id,
					"fabric_id" : jean.fabric_id,
					"accent_thread_id" : jean.accent_thread_id,
					"top_thread_id" : jean.top_thread_id,
					"bottom_thread_id" : jean.bottom_thread_id
				}
			}
		};
		
				
		function parseURLkey(key){
			switch(key){
				case "g":
	      return "gender_option_id";
	      break;
	      
	      case "s":
	      return "style_option_id";
	      break;
	      
	      case "f":
	      return "fabric_id";
	      break;
	      
	      case "tt":
	      return "top_thread_id";
	      break;
	      
	      case "tb":
	      return "bottom_thread_id";
	      break;
	      
	      case "ta":
	      return "accent_thread_id";
	      
	      default: return false;
			}
		}
		
		
		
		
		reset = function(){
			createNew();
		}
		
		buildJeanData = function(data, copy){

			//Make a copy
			if(copy==true){
				delete data.user_id;
				delete data.id;
				if(data.name) data.name = "Copy of "+data.name;
			}
			for(prop in data){
				if(data.hasOwnProperty(prop)){
					set(prop, data[prop]);	
				}
			}
		}
		
		//Set up jean data from parameter
		var setup = function(data, action){
			
			var defer = $q.defer();
			//If we don't have a logged in user, we want to force a copy...
			var userProp = $window.location.hostname==='localhost' ? "bdUserId_dev" : "bdUserId";
			var userId = parseInt($window.localStorage.getItem(userProp));
			var makeCopy = userId ? false : true;
			makeCopy = action == "copy" ? true : makeCopy;
			
			//Set up jean from object data
			if (data !== null && typeof data === 'object'){
				
				if (data.user_id && data.user_id !== userId) delete data.id;
				buildJeanData(data, makeCopy);
				defer.resolve(jeanData);
			}
			
			//Copy jean from data URL
			else if (data !== null && data !== undefined && isNaN(data)){
				var jeanObj = {};
				dataArr = data.split('-');
				for(var i=0; i<dataArr.length; i++){
					var d = dataArr[i].split(":");
					var key = parseURLkey(d[0]);
					jeanObj[key]=d[1];
				}
				buildJeanData(jeanObj, true);
				defer.resolve(jeanData);
			}

			//Copy or Edit Jean from Id
			
			else if (data !== null && data !== undefined){
				//First get Jean
				api.call('getJean', data, function(result){
					if (result.user_id !== userId) makeCopy = true;

					buildJeanData(result, makeCopy);
					defer.resolve(jeanData);
				}, function(err){
						defer.reject(err)
				});
			}

			//Jean Data already exists
			else if (Object.keys(jeanData).length > 0){
				defer.resolve(jeanData);
			}
			
			else{
				createNew();			
				defer.resolve(jeanData);
			}
			
			//Data URL
			/*
			else if ($routeParams.jeanId && !$routeParams.userId){
				createNew();
				if ($routeParams.jeanId.indexOf(":")>0){
					jeanData = $routeParams.jeanId.split(":");
					for(var d=0; d<jeanData.length; d++){
						var parts= jeanData[d].match(/([A-Za-z]+)([0-9]+)/);
						if (!parts) continue;
						var jeanKey = parseURLkey(parts[1]);
						if (jeanKey) jeanData[jeanKey] = parseInt(parts[2]);					
					}
				}
				defer.resolve(jeanData);
			}
			*/
			
			
					
							
				/*bdAPI.jeansGet($routeParams.userId, $routeParams.jeanId).then(					
					function(result){

						var newJean = result.data;

						var userData = aws.getCurrentUserFromLocalStorage();
						
						if(userData){
							
							var identityId = bdAPI.setupHeaders(userData);							
							//Edit Jean
							if (identityId == $routeParams.userId){
								for(prop in newJean){
									if(newJean.hasOwnProperty(prop)){
										set(prop, newJean[prop]);	
									}
								}
							}							
							//Copy Jean
							else{
								createNew(newJean);
							}

						}
						
						//Not logged in.. create new.
						else {
							createNew(newJean);
						}
						
						defer.resolve(jeanData);
					}, 
					function(err){
						//Jean or user not found.. just create a blank jean...
						console.log(err);
						createNew();
						defer.resolve(jeanData);
					}
				);
				*/
		
					
			

			
			return defer.promise;
		}
		
		
		var get=function(){
			return jeanData;
		}
		
		
		
		var deleter = function (jeanId, callback){
			api.call('deleteMyJean', jeanId, function(result){
				if (callback) callback(result);
			});
		};
		
		
		
		
		//Test jean for existing image in s3
		var testJeanForExistingImage = function(jeanData, dataCode, callback, errCallback){
			console.log("testing for ex...");
      var filename = dataCode+".jpg";
      var imageUrl = "https://s3.amazonaws.com/bluedelta-data/jeans/"+filename;
			
      console.log(imageUrl);
      //Thumbnail already exists..
      $http.get(imageUrl)
        .success(function(result){
        	console.log("IT EXISTS!!!");
          //We got the image... handle both orders and jeans... just to be safe
          jeanData.image_url = imageUrl;
          jeanData.jean_image_url = imageUrl;
          if (callback) callback(jeanData);
        })
        
        //Need to create a new Thumbnail
        .error(function(err, code){
        	console.log("ERROR>.. create an image");
          //There was an error...
          api.createThumb(jeanData).then(function (blob) {
            jeanData.image = {data:blob, filename:filename};
            if (callback) callback(jeanData)
          }, function(err){
          	if(errCallback) errCallback(err);
					});
        });
		};
		
		
		
		var save = function(){
			var jean = this;
			var jeanData = jean.get();
      var defer = $q.defer();
      var dataCode = api.getDataCode(jeanData);
      testJeanForExistingImage(jeanData, dataCode, function(jeanData){
        api.call('createMyJeans', jeanData, function(result){
          defer.resolve(result);
        }, function(err){
          defer.reject(err);
        });
			});
      return defer.promise;
		};
		
		
			
		return {
	    //dataLookup: api.lookup,
	    deleter : deleter,
	    save : save,
	    get : get,
	    set: set,
	    setup : setup,
	    reset : reset,
      set : set,
      testJeanForExistingImage:testJeanForExistingImage,
      createNew :createNew,
      getDataCode: getDataCode
     }
			
		
  }

})();