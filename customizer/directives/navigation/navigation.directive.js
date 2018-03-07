(function () {

  angular
    .module('bdApp')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/navigation/navigation.template.html?v=2',
      controller: 'navigationCtrl as navvm'
    };
  }

})();