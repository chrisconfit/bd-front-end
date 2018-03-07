(function () {

  angular
    .module('inspinia')
    .directive('sorter', [function() {
    	
			return {
	    	
	      restrict: 'EA',
				template: '<span class="sorter"><i ng-click="change(column, true)" ng-class="{\'active\': orderby==column&&order==\'ASC\'}" class="fa fa-angle-up"></i><i ng-click="change(column, false)" class="fa fa-angle-down" ng-class="{\'active\': orderby==column&&order==\'DESC\'}"></i></span>',
				replace:true,
	      scope : {
		      orderby : '=',
		      order: '=',
	        change : '=',
	        column: '='
	      }
	   };
    
    
  }]);

})();