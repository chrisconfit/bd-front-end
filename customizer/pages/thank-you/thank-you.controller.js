(function() {
  
  angular
    .module('bdApp')
    .controller('tyCtrl', tyCtrl);
  
  tyCtrl.$inject = ['user', '$routeParams', '$location'];
  
  function tyCtrl (user, $routeParams, $location) {
    var vm = this;
  
    if(!$routeParams.type){
      $location.path('/login');
    }
    vm.type=$routeParams.type;
    vm.userLoggedIn = user.isLoggedIn();
    vm.user = user.get();
  
    vm.logout = function(){
      user.logout(function(){
        vm.orderErr = false;
        vm.user = {};
        vm.user.loaded=true;
        vm.userLoggedIn = user.isLoggedIn();
        $location.path('/login');
      }, false)
    };
  }
})();