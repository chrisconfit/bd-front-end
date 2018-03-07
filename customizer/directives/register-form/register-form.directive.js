(function () {

  angular
    .module('bdApp')
    .directive('registerForm', registerForm);
		

	
  function registerForm () {
    return {
      restrict: 'AE',
      templateUrl: '/directives/register-form/register-form.template.html',
      controller: 'registerFormCtrl as regvm',
      scope : {
				redirect : "=?",
	      callback : "=?"
      }
    };
    
  }
  
    
  
  

})();