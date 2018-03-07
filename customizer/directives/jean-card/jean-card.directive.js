(function () {

  angular
    .module('bdApp')
    .directive('jeanCard', jeanCard);
    
	  function jeanCard () {
			return {
	    	
	      restrict: 'EA',
	      replace:true,
				template: '<ng-include src="templatePath"/>',
	      scope : {
	        click : '=?',
	        data: '=',
	      },
	      link: function link(scope, element, attrs) {
		      console.log(attrs);
					var slug = attrs.template ? attrs.template : "jean-card";
		      scope.templatePath="/directives/jean-card/"+slug+".template.html";
				}
	  	} 
	  }
  
    

})();
