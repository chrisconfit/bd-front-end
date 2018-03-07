(function () {

  angular
    .module('bdApp')
    .directive('fabricChooser', ['$window', function($window) {
    	
			return {
	    	
	      restrict: 'EA',
	      template: '<div class="fabric-chooser-container" ng-include="viewUrl"></div>',
	      controller: 'chooserCtrl as chvm',
	      scope : {
	        step : '=',
	        dataset: '=',
					active: '='
	      },
	      
	      link: function($scope){
		      
		      $scope.breakPoint = 800;
		      
		      //Template on window resize
		      $window.onresize = function() {
	          changeTemplate();
	          $scope.$apply();
	        };
	        
	        changeTemplate();
	            
	        function changeTemplate() {
	          var screenWidth = $window.innerWidth;
	          if (screenWidth < $scope.breakPoint) {
	            $scope.viewUrl = "/directives/choosers/fabric-chooser.template-mobile.html";
	          } else if (screenWidth >= $scope.breakPoint) {
	            $scope.viewUrl = "/directives/choosers/fabric-chooser.template-desk.html";
	          }
	        }
		      
		      
		      function positionChooser(){
			    	//element.animate({scrollLeft: element.offset().left - 50}, "slow");
			    	//var selector = angular.element(document.querySelector("#"+attr+"-selector"));  
		      }
		      
		      
		      //Weight Filter
		      $scope.weightFilter = function(min, max){
						return function(fabric){
							if (fabric.weight == 0) return false;
							if (min && fabric.weight < min) return false;
							if (max && fabric.weight > max) return false;
					    return true;
					  }
					};
	      }
	      
	   };
    
    
  }]);

})();