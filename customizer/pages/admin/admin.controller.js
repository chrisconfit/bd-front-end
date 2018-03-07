(function() {
  
  angular
    .module('bdApp')
    .controller('adminCtrl', adminCtrl);

  adminCtrl.$inject = ['$location', 'meanData'];
  function adminCtrl($location, meanData) {
	  
	  
    var vm = this;

    vm.user = {};
    meanData.getOptions()
      .success(function(data) {
	      console.log("admin.controller.jsln16:::");
        console.log(data);
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();