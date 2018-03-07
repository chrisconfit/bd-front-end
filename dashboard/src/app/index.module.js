(function() {
  'use strict';

  angular
    .module('inspinia', [ 'oc.lazyLoad', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'user', 'api', 'sqPaymentForm'])
    .config( ['$compileProvider', function( $compileProvider ){   
	      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|square-commerce-v1):/);
	      // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
		  }
		])
			.filter('ccName', function(){
				return function(input){
					switch (input){
						case "AMERICAN_EXPRESS":
							var ret = "AMEX";
							break;

						default:
							var ret = input;
					}
					return ret;
				}
			})
    .filter('paginate', function() {
		  return function(input, limit, begin) {
			  if (!input)return false;
			  console.log("input");
				console.log(input.slice(begin, begin + limit));
		    return input.slice(begin, begin + limit);
		  };
	  })
	  .filter('routeToClass', function () {
		  return function (input) {
		      return input.replace(/\./g, '-');
		  };
		})
	  .filter('dateInMillis', function() {
	    return function(dateString) {
	      return Date.parse(dateString);
	    };
	  })
		.filter('spaceless',function() {
			return function(input) {
				if (input) {
					return input.replace(/\s+/g, '-');
				}
			}
		})
		.filter('tel', function () {
	    return function (tel) {
	        if (!tel) { return ''; }
	
	        var value = tel.toString().trim().replace(/^\+/, '');
	
	        if (value.match(/[^0-9]/)) {
	            return tel;
	        }
	
	        var country, city, number;
	
	        switch (value.length) {
	            case 10: // +1PPP####### -> C (PPP) ###-####
	                country = 1;
	                city = value.slice(0, 3);
	                number = value.slice(3);
	                break;
	
	            case 11: // +CPPP####### -> CCC (PP) ###-####
	                country = value[0];
	                city = value.slice(1, 4);
	                number = value.slice(4);
	                break;
	
	            case 12: // +CCCPP####### -> CCC (PP) ###-####
	                country = value.slice(0, 3);
	                city = value.slice(3, 5);
	                number = value.slice(5);
	                break;
	
	            default:
	                return tel;
	        }
	
	        if (country == 1) {
	            country = "";
	        }
	
	        number = number.slice(0, 3) + '-' + number.slice(3);
	
	        return (country + " (" + city + ") " + number).trim();
	    };
	});
	

})();
