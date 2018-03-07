(function() {
  'use strict';

  angular
    .module('inspinia')
    .run(["$rootScope", "$state", "user", "api", "$location", runBlock]);

  /** @ngInject */
  function runBlock($rootScope, $state, user, api, $location) {
    var locationSearch = {};
	  api.getAppData();
		
		///Set up user if already logged in
		if (user.getToken()){
			user.setup();
		}
		
		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, err){
		  console.log('$stateChangeError - fired when an error occurs during transition.');
		  console.log(arguments);
		});
		
		
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			console.log(toState.name, fromState.name);
			//Only preserve params when moving from clients edit to orders list or when the state name remains the same...
			if(
				toState.name == 'orders.list' && fromState.name == 'clients.edit' ||
				toState.name == fromState.name  ||
				!fromState.name
			)
			locationSearch = $location.search();
			
			else locationSearch = {};
			
     
      if (toState.authenticate && (!user.isLoggedIn() || !user.isAdmin()) ){
      
	    	console.log("NOT LOGGED IN!!! "+!user.isLoggedIn());
        console.log("NOT ADMIN IN!!! "+!user.isAdmin());
        
	      $state.transitionTo("login");
	      event.preventDefault(); 
	    }
	  });
    $rootScope.$on('$stateChangeSuccess', function() {
      $location.search(locationSearch);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  
		
  }

})();
