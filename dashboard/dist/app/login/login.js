'use strict';

angular.module('inspinia')
  .controller('LoginController', ['$scope', '$state', 'user', function ($scope, $state, user) {

    var logvm = this;
    
		logvm.msg = {
			type: "alert-danger",
			message : "",
			reset : function(){
				this.message="";
			},
			set: function(msg, type){
				this.message = msg;
				this.type = type
			}
		}
		
		
    logvm.email="";
    logvm.password="";


    logvm.signupForm = function(form) {

	    if (form.$valid) {
				
				logvm.msg.reset();
	      user.login(logvm.email,logvm.password, function(result){
						$state.go('orders.list');
					},
					function(err){
						if (err.message == "Incorrect username or password.") err.message = "Incorrect Email address or password."
						logvm.msg.set(err.message,"alert-danger");
					},
				true );

      } else {
        form.submitted = true;
      }

    }

  }]);
