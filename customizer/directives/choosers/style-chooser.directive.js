(function () {

  angular
    .module('bdApp')
    .directive('styleChooser', styleChooser);
		
  function styleChooser () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/choosers/style-chooser.template.html',
      controller: 'chooserCtrl as chvm',
      scope : {
        step : '=',
        dataset: '=',
        active: '='
      },
      link: function($scope){
	      $scope.checkGenderFilter = function(gender){
					return function(style){
						g = gender == 1 ? "male":"female";
						return style[g];
				  }
				};
	    }
     

    };
  }

})();