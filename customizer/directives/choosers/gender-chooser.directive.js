(function () {

  angular
    .module('bdApp')
    .directive('genderChooser', genderChooser);
		
  function genderChooser () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/choosers/gender-chooser.template.html',
      controller: 'chooserCtrl as chvm',
      scope : {
        step : '=',
        dataset: '=',
        active: '='
      }
    };
  }

})();