(function () {

  angular
    .module('bdApp')
    .controller('loginFormCtrl', loginFormCtrl);

  loginFormCtrl.$inject = ['$location', 'user', 'messages', '$scope','api'];
  
  function loginFormCtrl($location, user, messages, $scope, api) {
    var logvm = this;
    
		logvm.messages=messages.get();
		
		logvm.credentials = {
      loginEmail : "",
      loginPassword : ""
    };
    
    
  	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
		}
		
		
    /*
    *
    * LOGGING IN
    *
    */
   
    //Log user in and send errors to "messages"
		logvm.login = function(email, password){
			messages.reset();
	    if (logvm.validateLoginForm()){
		    console.log('valid');
	      user.login(email, password, function(){
					if ($scope.callback) $scope.callback();
					if ($scope.redirect && $scope.redirect !== "NULL") $location.path($scope.redirect);
					if (!$scope.callback && !$scope.redirect)	$location.path('/closet');
				},
				function(err){
					if (err.message == "Incorrect username or password.") err.message = "Incorrect Email address or password."
					messages.set(err.message,"error");
				});
		  }
		}
		
		//Login form validation
		logvm.validateLoginForm = function(){				
			if(!validateEmail(logvm.credentials.loginEmail)){
				messages.set("Please enter a valid Email address", "error");
				return false;
			}
			if (!logvm.credentials.loginPassword){
				messages.set("Please enter a password", "error");
				return false;
			}
			return true;	
		}
		
		
		
		/*
		*
		*  Forgot Password
		*
		*/
		
		function validatePassword(password){
			//var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$/;
			//return re.test(password);
    	return password.length > 5 && password.length < 51 && password.search(/\d/)>-1 &&  password.search(/[a-z]/i);
  	}

		logvm.forgotPassword = false;
		logvm.forgotPassword2 = false;
		if($location.path()=="/customer-register/"){
			logvm.forgotPassword = true;			
			logvm.customerReset = true;
			if($location.search().email){
				logvm.credentials.loginEmail = $location.search().email;
			}
		}
		

		
		/* STEP 1 */
		logvm.getResetToken = function(){	
			messages.reset();
	    if (logvm.validateForgot()){	
		    console.log("running func from user");	    
				user.getResetToken(logvm.credentials.loginEmail, 
					function(result){ logvm.forgotPassword2 = true; },
					function(err){
						err.message = err.message == "Username/client id combination not found" ? "We don't have an account registered for that email" : err.message;
						messages.set(err.message,"error");
					}
				);
		  }
		};
		
		//Forgot password set 1 validation
		logvm.validateForgot = function(){				
			if(!validateEmail(logvm.credentials.loginEmail)){
				messages.set("Please enter a valid Email address", "error");
				return false;
			}
			return true;	
		};
		
		/* STEP 2 */	
		logvm.resetPassword = function(){
			messages.reset();
	    if (logvm.validateForgot2()){
				data={
					"email":logvm.credentials.loginEmail, 
					"token":logvm.credentials.loginVerifcation, 
					"password":logvm.credentials.newPassword
				}		    
		    user.resetPassword(data, 
					function(result){
		    		console.log(result);
						messages.set("Password reset successfully. Try logging in.", "success");
						logvm.forgotPassword = false;
						logvm.forgotPassword2 = false;
					},
					function(err){
						messages.set(err.message,"error");
					}
				);
		  }
		}
		
		//Forgot password set 1 validation
		logvm.validateForgot2 = function(){				
			if(!validateEmail(logvm.credentials.loginEmail)){
				messages.set("Please enter a valid Email address", "error");
				return false;
			}
			
			if (!logvm.credentials.loginVerifcation){
				messages.set("Please enter your verifcation code", "error");
				return false;
			}

			if (!validatePassword(logvm.credentials.newPassword)){
        messages.set("A valid password must: <ul><li>Be between 6 and 50 characters</li><li>Contain at least one number</li><li>Contain at least one letter</li>");
			}

			if (logvm.credentials.newPassword !== logvm.credentials.newPasswordConfirm){
				messages.set("Password and Confirmation do not match", "error");
				return false;
			}
			
			return true;	
		}
	
		//Log in via Facebook
		logvm.loginFB = function(){
			
		}

			
  }

})();