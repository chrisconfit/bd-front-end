(function () {

  angular
    .module('bdApp')
    .directive('imageStack', imageStack);
		

	
  function imageStack () {
    return {
      restrict: 'AE',
      templateUrl: '/directives/image-stack/image-stack.template.html',
      controller: 'istackCtrl as isvm',
      scope : {
        jeanData : '='
      },
      link: function(scope, ele, attrs, ctrl) {
	      
	     
	     ele.on('touchstart', function(e){
			 	scope.isvm.touchStart(e);	
	     });	
	     
	     ele.on('touchmove', function(e){
			 	scope.isvm.touchMove(e);	
	     });		
	     
	     ele.on('touchend', function(e){
			 	scope.isvm.touchEnd(e);	
	     });				
			
       
	      /*
	      $swipe.bind(ele, {
          'move': function(event) {
						scope.isvm.scanImage(coords.x,coords.y);
          }
	      });
	     */

	    }
    };
    
  }
  
    
  
  

})();