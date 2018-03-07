(function () {

  angular
    .module('bdApp')
    .controller('registerFormCtrl', registerFormCtrl);

  registerFormCtrl.$inject = ['$scope', '$location', 'user', '$sce', 'messages'];
  
  function registerFormCtrl($scope, $location, user, $sce, messages) {
    var regvm = this;
    
		regvm.messages=messages.get();
		
		regvm.credentials = {
      first_name : "",
      last_name:"",
      email : "",
      password : ""
    };
	
		//Validate Registration Form
		regvm.validateRegistrationForm = function () {
						
			function validatePassword(password){
				//console.log(regvm.credentials.password.length > 5);
				//contains numbers
				//console.log(regvm.credentials.password.search(/\d/)>-1);
				//contains lowercase letters
				//console.log(regvm.credentials.password.search(/[a-z]/) > -1);
				//contains uppercase letters
				//console.log(regvm.credentials.password.search(/[A-Z]/) > -1);
				
				//RE to test all
				//var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$/;
			
				return (
					regvm.credentials.password.length > 5 &&
					regvm.credentials.password.length < 51 &&
					regvm.credentials.password.search(/\d/)>-1 &&
        	regvm.credentials.password.match(/[a-z]/i)
				);
			}			
								
			function validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
			}
			
			if (!regvm.credentials.email || !regvm.credentials.first_name || !regvm.credentials.last_name || !regvm.credentials.password || !regvm.credentials.passwordConfirm){
				messages.set("All fields are required", "error");
				return false;
			}
			
			if (!validatePassword(regvm.credentials.password)){
				messages.set("A valid password must: <ul><li>Be between 6 and 50 characters</li><li>Contain at least one number</li><li>Contain at least one letter</li>");
				return false;
			}
			
			if (regvm.credentials.password !== regvm.credentials.passwordConfirm){
				messages.set("Password and Confirmation do not match", "error");
				return false;
			}
			
			if(!validateEmail(regvm.credentials.email)){
				messages.set("Please Enter a valid E-mail address", "error");
				return false;
			}
			
			return true;
			
		}
		
		
		
		//Register User
    regvm.registerUser = function () {
	    messages.reset();
	    var valid = regvm.validateRegistrationForm();
	    console.log(valid);
	    if(!valid) return false;
	    else{
		    user.register(regvm.credentials.email, regvm.credentials.password, regvm.credentials.first_name, regvm.credentials.last_name, function(){
					if ($scope.callback) $scope.callback(regvm.credentials);
					if ($scope.redirect) $location.path($scope.redirect);
					if (!$scope.callback && !$scope.redirect)	$location.path('/closet');    
		    },   
		    function(err){
			    if (err.message = "Duplicate email address") err.message = "This user is already registered.";
				  messages.set(err.message, "error");
			  });			  
		  }
    };	
    
    
    		
  }

})();