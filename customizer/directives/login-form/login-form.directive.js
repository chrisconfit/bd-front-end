(function () {

  angular
    .module('bdApp')
    .directive('loginForm', loginForm);
		

	
  function loginForm () {
    return {
      restrict: 'AE',
      templateUrl: '/directives/login-form/login-form.template.html',
      controller: 'loginFormCtrl as logvm',
      scope : {
				redirect : "=?",
	      callback : "=?",
	      forgot : "=?"
      }
    };
    
  }
  
    
  
  

})();