(function() {
  
  angular
    .module('bdApp')
    .controller('customizerCtrl', customizerCtrl);

  customizerCtrl.$inject = ['api', 'user','$filter','$location', '$routeParams', 'jean', '$scope', 'popups', 'messages', 'loader', 'apiData', '$window'];
  function customizerCtrl(api, user, $filter, $location, $routeParams, jean, $scope, popups, messages, loader, apiData, $window) {
		
    var vm = this
		
		//Setup Loader		
		vm.loader = loader.get();
		
		//Set up shared messages service
		messages.reset();
		vm.messages=messages.get();
	
		//Set up shared popups service
		popups.closeAll();
		vm.popups = popups.get();

		//Set up Jean
		var jeanId;
		if ($routeParams.jeanId) jeanId = $routeParams.jeanId;
		var action = false;
		if ($routeParams.action) action = $routeParams.action;
		
		jean.setup(jeanId, action).then(function(result){
			vm.jeanData=jean.get();
			
			$scope.$watch(function() {
				return vm.jeanData;
			}, function(current, original) {
				vm.shareImageUploaded=false;
				vm.displaySocial=false;
        vm.displaySocialHelper=false;
				vm.updateActiveItem();
			}, true);
			
			$scope.$watch(function() {
				return vm.data;
			}, function(current, original) {
				vm.updateActiveItem();
			}, true);

		}, 
		
		
		function(err){
			//Test for jean not found...
			if(err.message = "Invalid Jean ID"){
				popups.set('noJean',true);
			}

		});

			
		
		
		
	

		//Detect Orientation			
		function landscapeDetect() {
		  var ua = navigator.userAgent.toLowerCase();
		  var isAndroid = ua.indexOf("android") > -1; // Detect Android devices
		  if (isAndroid) {
		    //window.orientation is different for iOS and Android
		    if (window.orientation == 0 || window.orientation == 180) { //Landscape Mode
		      return true;
		    }
		    else if (window.orientation == 90 || window.orientation == -90) { //Portrait Mode
					return false;
		    }
		  }
		  else {
		    if (window.orientation == 90 || window.orientation == -90) { //Landscape Mode
		      return true;
		    }
		    else if (window.orientation == 0 || window.orientation == 180) { //Portrait Mode
		      return false;
		    }
		  }
		}
    
    vm.landscape=landscapeDetect();
  	var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
		
		window.addEventListener(orientationEvent, function() {	
			//Set a scope variable on orientation change. This will display a popup on the front end warning users that the customizer works best in protrait mode
		  vm.landscape=landscapeDetect();
		  $scope.$apply();
		}, false);
		
		
		
		
    /*
		*
		* GET CUSTOMIZER DATA 
		*
		*/	
		vm.data = apiData;
		vm.activeItem={};
		
		vm.updateActiveItem = function(){
			if (!vm.jeanData) return false;
			var data = vm.data[vm.panel[vm.panelStep].dataKey];
			var id = vm.jeanData[vm.panel[vm.panelStep].jeanKey];
			var ret = $filter('filter')(data, {id: id});
			if (ret) ret = ret[0];
			vm.activeItem = ret||null;
		}

		//Build Control Panel Steps
		vm.panel = [];
		
		//Gender
		vm.panel.push({
			"panelTemplate":"gender-chooser",
			"dataKey":"gender_options",
			"title":"Gender",
			"jeanKey":"gender_option_id"
		});
		
		//Style
		vm.panel.push({
			"panelTemplate":"style-chooser",
			"dataKey":"style_options",
			"title":"Style",
			"jeanKey":"style_option_id"
		});
		
		//Fabric
		vm.panel.push({
			"panelTemplate":"fabric-chooser",
			"dataKey":"fabrics",
			"title":"Fabric",
			"jeanKey":"fabric_id"
		});
		
		//Top Thread
		vm.panel.push({
			"panelTemplate":"chooser",
			"dataKey":"threads",
			"title":"Top Thread",
			"jeanKey":"top_thread_id"
		});
		
		//Bottom Thread
		vm.panel.push({
			"panelTemplate":"chooser",
			"dataKey":"threads",
			"title":"Bottom Thread",
			"jeanKey":"bottom_thread_id"
		});
		
		//Accent Thread
		vm.panel.push({
			"panelTemplate":"chooser",
			"dataKey":"threads",
			"title":"Accent Thread",
			"jeanKey":"accent_thread_id"
		});
		
		//Overview
		vm.panel.push({
			"panelTemplate":"list",
			"title":"Overview"
		});
		
		vm.panelDir="next";		
		vm.panelStep = 0;
		vm.changeStep = function(step){
			if (step >= vm.panel.length) return false;
			if (step < 0) return false;
			if (step===undefined) return false;
			else vm.panelStep = step; 
			
			//As long as we're not on the "Overview" Step, update active item...
			if (step+1 != vm.panel.length) vm.updateActiveItem();
		}
  
    //Working with data url...
    if (jeanId && jeanId.indexOf(':')>-1 && $window.innerWidth < 800) vm.panelStep = 2;
		
		/*
		*
		* Control Panel actions
		**
		*/
	
		

		vm.savingBar = false;
		vm.newJeanName = "My New Jeans";
		vm.authCallback;
		vm.saveCallback;
		
		var openSaveOpts = function(){
			popups.set('saveOpts',true);
		};
		
		var redirectToOrder = function(jean){
			$location.path('/order/'+jean.id);
		};
		
		vm.saveAndOrder = function(){
			vm.saveCallback = redirectToOrder;
			vm.runSave();
		};
		
		vm.saveAndShowOpts = function(){
			vm.saveCallback = openSaveOpts;
			vm.runSave();
		};
	
    vm.keepEditing = function(){
    	console.log("KEEP ED..");
    	console.log(vm.jeanData.id);
    	console.log(parseInt($routeParams.jeanId));
			if(parseInt($routeParams.jeanId) !== vm.jeanData.id) $location.path('/customizer/'+vm.jeanData.id);
			else popups.closeAll();
    };
    
    vm.goToCloset = function(){
	    $location.path('/closet');
    };
    
    vm.startOver = function(){
	    jean.reset();
	    vm.jeanData=jean.get();
	    popups.closeAll();
    };
    
    //Check for jean name, run save, and ex callback
		vm.runSave = function(){
			popups.closeAll();
			
			if(!vm.jeanData.name) popups.set('namer', true);
			
			else{
				vm.savingBar = true;
				jean.save().then(
					function(result){
						vm.jeanData = result;
						vm.savingBar = false;
						if (vm.saveCallback){ 
							vm.saveCallback(result);
						}
					}
				);
			} 
		}
    
    //When Order is clicked...
    vm.placeOrder=function(){
			if(!user.isLoggedIn()){
				vm.authCallback = vm.saveAndOrder;
				popups.set('loginOrRegister',true);
				return false;
			}
			else {
				vm.saveAndOrder();
			}
		}

		vm.socialAuthCheck = function(callback){
			if(!user.isLoggedIn()){
				vm.authCallback = callback;
				popups.set('loginOrRegister',true);
				return false;
			}
			else {
				callback();
			}
		}
		
    //When Save is clicked....
    vm.saveJean = function(){
			if(!user.isLoggedIn()){
				vm.authCallback = vm.saveAndShowOpts;
				popups.set('loginOrRegister',true);
				return false;
			}
			else vm.saveAndShowOpts();
  	}
    
    
    //Set default auth callback  
    vm.registerCallback = function(details){
	  }
   
	  vm.shareImageUploaded=false;
	  vm.displaySocial=false;
    vm.displaySocialHelper=false;
    vm.share = function(display){
    	console.log("here it is");
    	console.log(display);
    	if(vm[display]==true){
    		vm[dispaly]=false;
			}else {
        vm[display] = true;
        var dataCode = api.getDataCode(vm.jeanData);
        var jeanData = angular.copy(vm.jeanData);
        delete jeanData.image;
        delete jeanData.image_url;
        jean.testJeanForExistingImage(jeanData, dataCode, function (jeanData) {
          //Image doesn't exist.. create and upload
          if (!jeanData.image_url) {
            api.call('uploadJeanThumb', jeanData.image, function (result) {
              console.log("Image has been uploaded: " + result.url);
              vm.shareImageUploaded = true;
            })
          }
          //Image already exists... run share
          else {
            vm.shareImageUploaded = true;
          }
        });
      }
		}
    


		
  }

})();3