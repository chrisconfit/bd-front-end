(function() {
  
  angular
    .module('bdApp')
    .controller('homeCtrl', homeCtrl);
			
		homeCtrl.$inject = ['$window', 'user', 'api'];
		
		
    function homeCtrl ($window, user, api) { 	    
			var vm = this;	
			vm.user = user.get();
			console.log($window.localStorage.getItem("bdAccessToken"));
    }

})();