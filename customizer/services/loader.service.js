
(function() {

  angular
    .module('bdApp')
    .service('loader', ['$rootScope', loader]);

  function loader() {
		
		var loader = {}
    
    var loaderDefaults = {
	    "message":"",
	    "type":"loading",
	    "icon":"fa-circle-o-notch fa-spin",
	    "active":false
    };
    
  
	        
		var closeAll = function(){
			for (var pop in pops) {
			  if (pops.hasOwnProperty(pop)) {
			    pops[pop]=false;
			  }
			}
		}
    
    var  show = function(message, type, icon){
	    loader.active = true;
	    loader.message=message || loaderDefaults.message;
	    loader.type = type || loaderDefaults.type;
	    loader.icon = icon || loaderDefaults.icon;
    }
    
    var hide = function(){
	    loader.active=false;
    }
    
    var get = function(){
	    return loader;
    }
    
    return {
	    get:get,
	    show:show,
	    hide:hide
    }
  }

})();