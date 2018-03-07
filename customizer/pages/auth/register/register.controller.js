(function () {

  angular
    .module('bdApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['messages'];
  function registerCtrl(messages) {
    var vm = this;

		messages.reset();
    vm.messages = messages.get();
    vm.formStep=1;
    		
/*    					
		//ConfirmUser with Registration Code
    vm.confirmUser = function() {
			vm.resetMessage();
			aws.confirmRegisteredUnauthenticatedUser(vm.credentials.email, vm.credentials.code).then(
      	function(result){
					vm.setMessage($sce.trustAsHtml("Your Account has been confirmed. <a href='/login'>Click here to login</a>"), "success");
	      },   
	      function(err){
		      if (err.message == "Missing required key 'ConfirmationCode' in params") err.message = "Please enter confirmation code";
			    vm.setMessage(err.message, "error");
		    }
		  );
    };
    
    //Resend Registration code to user via email
    vm.resendCode = function(){
	    //This function throws an error in the SDK and no result... cannot implement promise for now
	    aws.resendConfirmationCode(vm.credentials.email);
	    //We're going to show a success message no matter what
	    //TODO: Implement corrected SDK and promise structure for this functino
	    vm.setMessage("A new confirmation code has been sent to "+vm.credentials.email+". Enter the code above to confirm your account", "success");
    };

*/
  }

})();