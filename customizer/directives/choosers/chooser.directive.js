(function () {

  angular
    .module('bdApp')
    .directive('chooser', chooser);
		
  function chooser () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/choosers/chooser.template.html',
      controller: 'chooserCtrl as chvm',
      scope : {
        step : '=',
        dataset: '=',
        active: '='
      }
    };
  }

})();