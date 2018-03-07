(function () {

  angular
    .module('bdApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['user', 'loader', 'jean'];
  function navigationCtrl(user, loader, jean) {
    var vm = this;

		vm.loader = loader.get('loader');
		vm.saver = loader.get('saver');
		vm.drops={};
		vm.drops.acct=false;
		vm.mobileMenu = false;
				
		vm.isLoggedIn = user.isLoggedIn();

		vm.logout = function(){			
			user.logout();
			jean.setup(jean.createNew());
		}
  }

})();