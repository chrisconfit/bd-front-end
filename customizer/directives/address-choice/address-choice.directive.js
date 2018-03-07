(function () {

  angular
    .module('bdApp')
    .directive('addressChoice', addressChoice);
		

	
  function addressChoice () {
    return {
      restrict: 'AE',
      templateUrl: '/directives/address-choice/address-choice.template.html',
      controller: 'addressChoiceCtrl as adcvm',
      scope : {
				user : '=',
        addressObject : '=?'
      }
    };
    
  }
  
    
  
  

})();