
(function() {

  angular
    .module('bdApp')
    .service('popups', ['$rootScope', popups]);

  function popups($rootScope) {
		
    var pops = {};
        
		var closeAll = function(){
			for (var pop in pops) {
			  if (pops.hasOwnProperty(pop)) {
			    pops[pop]=false;
			  }
			}
		}
    
    var set = function(pop, status){
	    if (!pops[pop]){
		    pops[pop] = true;
		    $rootScope.$broadcast('popupChange');
	    }
	    else{
		  	var status = status || pops[pop];
				pops[pop] = status;
			}
    }
    
    var get = function(){
	    return pops;
    }
    
    return {
	    get:get,
	    set:set,
	    closeAll:closeAll
    }
  }

})();