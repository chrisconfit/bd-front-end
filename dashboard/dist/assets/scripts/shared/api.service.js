
(function() {

  angular
    .module('api', [])
    .service('api', api);
		
	api.$inject = ['$location', '$http', '$q', '$rootScope', '$window'];

  function api($location, $http, $q, $rootScope, $window) {

		/*
		* SETUP
		*/
		
		var config = {
			client_id:2,
			client_secret: "8xHu3MLzZXr3pcUneGCM08XOzMc5rH5AOtJSCdIP",
			url :  "https://api.bluedeltajeans.com",
			headers: {'Content-Type':'application/json'}
		};
/*
	if($location.$$host == "localhost"){
			config.url = "http://bluedelta.local";
		}
*/
		var noTokenNecessary = [
			'login',
			'register',
			'getResetToken',
			'resetPassword',
			'forgotPassword',
			'getJean',
			'uploadJeanThumb',
			'swipeCallback'
		];
		
		//Call an API function and handle data.
		var isCustomizer = ($location.$$host=="localhost" && $location.$$port == 4000) || $location.$$host.split('.')[0]=="build";
		var tokenProp = isCustomizer ? "bdAccessToken":"bdDashAccessToken";
    if($location.$$host==="localhost") tokenProp+="_dev";
		var call = function(func, data, success, error){
			
			accessToken = $window.localStorage.getItem(tokenProp);
      //console.log(accessToken);
      //console.log("Token prop"+ tokenProp);
			//console.log('calling '+func+" with...");
			//console.log(data);

			if (noTokenNecessary.indexOf(func) < 0 && !accessToken){
				var message = "Request being made with no access token.";
				var err = new Error(message);
				throw err;
				if (error) error(err);
				return false;
			}

			this[func](data)
			.success(function(result){
				//console.log(func+" was a success:");
				//console.log(result);
				if (success) success(result);
				$rootScope.$$phase || $rootScope.$apply();
			})
			.error(function(err, status, headers) {
				console.log(err);
				if (error) error(err);
			});
			
		}
		
				
		//Build HTTP Request
	  var httpReq = function(method, path, data){
		
		  var headers=config.headers;
		  var token = $window.localStorage.getItem(tokenProp);
		  if (token) headers.Authorization = "Bearer "+token;
      
			var httpConfig = {
				"method": method,
				"url" : config.url+path,
				"headers" : headers,
			}	
			if(data){
				var dataKey = method=="POST" ? "data":"params"
				httpConfig[dataKey] = data;
			}
		  return $http(httpConfig);
		}
		
		

		/*
		*  AUTH
		*/
		
		var login = function(data){
			return httpReq("POST", "/api/login", data);
		};
		
		var register = function(data){
			return httpReq("POST", "/api/register", data);
		};
	  
	  var getResetToken = function(data){
			return httpReq("POST", "/api/passwordtoken",  {email:data});
		};
		
		var resetPassword = function(data){
			return httpReq("POST", "/api/passwordreset", data);
		};
	  
	  

	  
	  
	  
	  
	  
	  
	  /*
		*  JEANS
		*/
	  var getJean = function(data){
		  return httpReq("GET", "/api/jean/"+data);
	  }
	  
	  function jeanKeytoURL(key){
			switch(key){
				case "gender_option_id":
	      return "g";
	      break;
	      
	      case "style_option_id":
	      return "s";
	      break;
	      
	      case "fabric_id":
	      return "f";
	      break;
	      
	      case "top_thread_id":
	      return "tt";
	      break;
	      
	      case "bottom_thread_id":
	      return "tb";
	      break;
	      
	      case "accent_thread_id":
	      return "ta";
	      
	      default: return false;
			}
		}
		
		getDataCode = function(jeanData){
			var url = "";			
			for (var property in jeanData) {
			  if (jeanData.hasOwnProperty(property)) {
					var id = jeanData[property];
					var urlKey = jeanKeytoURL(property);
					if (urlKey) url += "-"+urlKey+":"+id;
			  }
			}	
			url = url.replace(/(^[_\s]+)|([_\s]+$)/g, '');
			return url.replace('-','');
		};
	  
		function loadImage(src) {
			return $q(function(resolve,reject) {
			  var image = new Image();
			  image.crossOrigin = "";
			  image.src = src;
			  image.onload = function() {
			    resolve(image);
			  };
			  image.onerror = function(e) {
			    reject(e);
			  };
			})
		}   
    
    function searchAndDraw(key, cntxt, images){
      for(i=0; i<images.length; i++){
        var image = images[i];
        if(image.src.indexOf("/"+key+"/") > -1){
          cntxt.drawImage(image,0,0,600,696);
        }
      }
    }
		
	  var createThumb = function(jeanData){
    	
    	var canvas = document.createElement('canvas');
	  	canvas.width=600;
	  	canvas.height=600;
	  	var cntxt = canvas.getContext('2d');	
	  	var promises = [];
			var images = [
        'http://bluedelta-data.s3-website-us-east-1.amazonaws.com/images/components/fabrics/g'+jeanData.gender_option_id+'/s2/f'+jeanData.fabric_id+'.jpg',
        'http://bluedelta-data.s3-website-us-east-1.amazonaws.com/images/components/threads/g'+jeanData.gender_option_id+'/s2/tb/'+jeanData.bottom_thread_id+'.png',
        'http://bluedelta-data.s3-website-us-east-1.amazonaws.com/images/components/threads/g'+jeanData.gender_option_id+'/s2/tt/'+jeanData.top_thread_id+'.png',
        'http://bluedelta-data.s3-website-us-east-1.amazonaws.com/images/components/threads/g'+jeanData.gender_option_id+'/s2/ta/'+jeanData.accent_thread_id+'.png'
			];
	
	    for(var i=0; i<images.length; i++){
	      promises.push(loadImage(images[i], cntxt));
	    }
	    return $q.all(promises).then(
	    	function(results) {
	    		console.log("IMAGES RESULTS!!!");
	    		console.log(results);
					searchAndDraw("fabrics", cntxt, results);
					searchAndDraw("tb", cntxt, results);
					searchAndDraw("tt", cntxt, results);
					searchAndDraw("ta", cntxt, results);
		      var dataUrl = canvas.toDataURL('image/jpeg');
					return dataUrl;
		    },    
		    function(err){
			    console.log(err);
		    }
	    );	
		};
		
		var uploadJeanThumb = function(data){
      return httpReq("POST", "/api/thumbnail", data);
		};
		
	  

	  
	  
	  
	  /*
		*  CURRENT USER DATA
		*/
		var postMyAddress = function(data){
			var path = "/api/users/current/addresses"
			if (data.id) path+="/"+data.id;
			return httpReq("POST", path, data);
		};

		var deleteMyAddress = function(addressId){
		  return httpReq("DELETE", "/api/users/current/addresses/"+addressId);			
		};
		
		var createMyJeans = function(data){
      var path = "/api/users/current/jeans";
      if (data.id) path +="/"+data.id;
		  return httpReq("POST", path, data);
	  };
		
		var getCurrentUser = function(){
			return httpReq("GET", "/api/users/current");
		};
		
		var getMyJeans = function(){
			return httpReq("GET", "/api/users/current/jeans");	
		};
		
		var getMyOrders = function(data){
			var path = "/api/users/current/orders";
			if (data) path +="/"+data;
			return httpReq("GET", path);
		};
		
		var updateMe = function(data){
			return httpReq("POST", "/api/users/current", data);	
		};
	  
	  var getMyJeans = function(){
		  return httpReq("GET", "/api/users/current/jeans");
	  };

	  var deleteMyJean = function(jeanId){
			return httpReq("DELETE", "/api/users/current/jeans/"+jeanId);
		};
		var placeMyOrder = function(orderCreateObj){
			return httpReq("POST", "/api/users/current/orders", orderCreateObj);
		};
  
    var updateMyOrder = function(orderCreateObj){
    	if(!orderCreateObj.id) return false;
      return httpReq("POST", "/api/users/current/orders/"+orderCreateObj.id, orderCreateObj);
    };

    var getMyCreditCards = function(){
      return httpReq("GET", "/api/users/current/cc");
    };

    var createMyCreditCard = function(data){
      return httpReq("POST", "/api/users/current/cc", data);
    };
	  
	  var createMyFitMatch = function(data){
      return httpReq("POST", "/api/users/current/fitmatch", data);
		};
	  /*
		* Admin API
		*/
	  var postOrderItem = function(data){
		  var path = "/api/orderItem"
			if (data.id) path += "/"+data.id;
		  return httpReq("POST", path, data);
	  };
	  
	  var usersList = function(data){
			return httpReq("GET", "/api/users", data);
	  };
		
		var userGet = function(userId){
			return httpReq("GET", "/api/users/"+userId);
		};
		
		var usersDelete = function(userId){
			return httpReq("DELETE", "/api/users/"+userId);
		};
		
		var usersCreateAddress = function(data){
			return httpReq("POST", "/api/users/"+data.userId+"/address", data.address);
		};
		
		var usersCreateJean = function(data){
			return httpReq("POST", "/api/users/"+data.userId+"/jeans", data.jean);
		};
		
		var usersCreateOrder = function(data){
			return httpReq("POST", "/api/users/"+data.userId+"/orders", data.order);
		};

		var usersCreateCreditCard = function(data){
			return httpReq("POST", "/api/users/"+data.userId+"/cc", data);
		};

		var usersGetUserCreditCards = function(userId){
			return httpReq("GET", "/api/users/"+userId+"/cc");
		};

		var usersPost = function(data){
			var path = "/api/users"
			if (data.id) path += "/"+data.id;
			return httpReq("POST", path, data);			
		};
		
		var ordersList = function(data){
			return httpReq("GET", "/api/orders", data);
	  };

		var orderGet = function(orderId){
			return httpReq("GET", "/api/orders/"+orderId);
		};
		
		var ordersDelete = function(orderId){
			return httpReq("DELETE", "/api/orders/"+orderId);
		};
		
		var ordersPost = function(data){
			var path = "/api/orders";
			if (data.id) path += "/"+data.id
			return httpReq("POST", path, data);
		};

		var ordersCharge = function(data){
		  return httpReq("POST", "/api/orders/"+data.orderId+"/charge", data);
    };
		
		var postAddress = function(data){
			var path = "/api/users/"+data.userId+"/addresses";
			if (data.address.id) path += "/"+data.address.id;
			return httpReq("POST", path, data.address);
		};
		
		var commentsCreate = function(data){
			return httpReq("POST", "/api/orders/"+data.orderId+"/comments", data.comment);
		};

		var swipeCallback = function(data){
		  return httpReq("POST", "/api/swipe", data);
    };

    var fitmatchList = function(data){
      return httpReq("GET", "/api/fitmatchrequests", data);
    };

    var fitmatchGet = function(fmId){
      return httpReq("GET", "/api/fitmatchrequests/"+fmId);
    };

    var fitmatchDelete = function(fmId){
      return httpReq("DELETE", "/api/fitmatchrequests/"+fmId);
    };

    var fitmatchPost = function(data){
      var path = "/api/fitmatchrequests";
      if (data.id) path += "/"+data.id
      return httpReq("POST", path, data);
    };
    var fitmatchCharge = function(data){
      return httpReq("POST", "/api/fitmatchrequests/"+data.fitmatchId+"/charge", data);
    };
  
		var sendInvoice = function(orderId){
			return httpReq("POST", "/api/orders/"+orderId+"/invoice");
		};
		
    var appData = {};
    appData.loaded=false;
    
		var getAppData = function(callback){
      httpReq("GET", "/api/data").then(function(result){
				for(key in result.data){
					if(result.data.hasOwnProperty(key)){
						appData[key] = result.data[key];
					}
				}
				appData.belt_loop_options = [
					{"id":1, "label":"Centered"},
          {"id":2, "label":"Split"},
          {"id":3, "label":"X-Pattern"}

				];
        appData.payment_statuses = [
          {"id":1, "label": "Awaiting Payment"},
          {"id":2, "label": "Paid"},
          {"id":3, "label": "Comped"}
        ];
        appData.pocket_options = [
          {"id":1, "label": "Normal"},
          {"id":2, "label": "Watch Pocket"},
          {"id":3, "label": "Fake Pocket"}
        ];
        appData.lookup = function(data, key, value, retKey){
          var dataSet = this[data];
          if (!dataSet) return;
          retKey = retKey || false;
          for (var i=0; i<dataSet.length; i++){
            if(dataSet[i][key] == value)
              return retKey ? dataSet[i][retKey] : dataSet[i]
          }
        };
        appData.loaded=true;
        if(callback) callback(appData);
			});
		};

		
		
    return {
			getData:function(){ return appData;},
			getAppData:getAppData,
			call : call,
			login: login,
			register: register,
			getResetToken:getResetToken,
			resetPassword:resetPassword,
      uploadJeanThumb:uploadJeanThumb,

			getJean:getJean,
			createThumb:createThumb,
			getDataCode:getDataCode,

			getCurrentUser:getCurrentUser,
			createMyJeans:createMyJeans,
			getMyOrders:getMyOrders,
			getMyJeans:getMyJeans,
			updateMe: updateMe,
			postMyAddress:postMyAddress,
			deleteMyJean:deleteMyJean,
			deleteMyAddress: deleteMyAddress,
			placeMyOrder: placeMyOrder,
      updateMyOrder:updateMyOrder,
      getMyCreditCards:getMyCreditCards,
			createMyCreditCard:createMyCreditCard,
      createMyFitMatch:createMyFitMatch,
			

			postOrderItem:postOrderItem,
			usersList:usersList,
			userGet:userGet,
			usersCreateCreditCard:usersCreateCreditCard,
			usersGetUserCreditCards: usersGetUserCreditCards,
			usersDelete:usersDelete,
			usersCreateJean:usersCreateJean,
			usersCreateAddress:usersCreateAddress,
			usersCreateOrder:usersCreateOrder,
			usersPost:usersPost,
			ordersPost:ordersPost,
			ordersList:ordersList,
			orderGet:orderGet,
			ordersDelete:ordersDelete,
      ordersCharge:ordersCharge,
      postAddress:postAddress,
			commentsCreate:commentsCreate,
      swipeCallback:swipeCallback,
      fitmatchList:fitmatchList,
      fitmatchGet:fitmatchGet,
      fitmatchDelete:fitmatchDelete,
      fitmatchPost:fitmatchPost,
      fitmatchCharge:fitmatchCharge,
      sendInvoice:sendInvoice
    };
    
  }

})();