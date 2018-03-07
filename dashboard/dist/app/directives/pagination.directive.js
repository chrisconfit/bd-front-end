(function () {

  angular
    .module('inspinia')
    .directive('pagination', [function() {
    	
			return {
	      restrict: 'EA',
				templateUrl: '/app/directives/pagination.template.html',
				replace:false,
	      scope : {
		      total : '=',
		      current: '=',
		      change: '='
	      },
	      link:function($scope){
		      
		      function addToPages(array, page){
			      if (page > $scope.total) return false;
			      if (array.length>4) return false;
			      if (page <= 0) return false;
			      if (!array.indexOf(page) > -1) array.push(page);
			    }
			    
			    $scope.endElipsTest = function(){
				    console.log('end el');
				    console.log($scope.current == $scope.total-3);
				    return !$scope.current == $scope.total-3;
			    }

		      $scope.getPages = function(){
			      if ($scope.total <= 1) return false;
						else{
							var pages = [];
							var index = -2
							if ($scope.current == $scope.total-1) index = -3
							if ($scope.current == $scope.total) index = -4
							for (i = index; i<=6; i++){ addToPages(pages,$scope.current + i); }
							return pages;
						}
												
					}
	      }
	   };
    
    
  }]);

})();