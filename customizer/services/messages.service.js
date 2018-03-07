(function() {

  angular
    .module('bdApp')
    .service('messages', messages);

	//meanData.$inject = [];
  function messages() {
	
		var data = {
			message : "",
			type: ""
		};
		
		var set = function(message, type){
			data.message = message;
			data.type = type;
		}
			
		var reset = function(){
			data.message = "";
			data.type = "";	
		};
		
		var get = function(){
			return data;
		}
		
    return {
	    get:get,
	    set:set,
	    reset:reset
    };
  }

})();