(function () {

  angular
    .module('bdApp')
    .directive('slider', slider);
		
  function slider () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/slider/slider.template.html',
      controller: 'sliderCtrl as slvm',
      scope : {
        slides : '=',
        imageClick : '&'
      }
    };
  }

})();