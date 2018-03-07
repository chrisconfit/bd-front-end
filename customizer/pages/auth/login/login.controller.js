(function () {

  angular
  .module('bdApp')
  .controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['messages'];
  function loginCtrl(messages) {
    var vm = this;
    
    messages.reset();
    vm.messages = messages.get();
    
  }

})();