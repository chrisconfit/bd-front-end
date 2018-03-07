
(function() {

    angular
        .module('sqPaymentForm', [])
        .directive('sqPaymentForm', sqPaymentForm);

    sqPaymentForm.$inject = [];

    function sqPaymentForm() {

        return {
            restrict: 'EA',
            template: '<div class="clearfix">\n' +
            '   <div class="sq-input-container cardNumber" ng-class="{active:f.cardNumber}"><div id="sq-card-number"></div><label>Card Number</label>\n' +
            '   <small style="display:block; margin-bottom:10px;" ng-show="errors.cardNumber" class="text-danger">{{errors.cardNumber}}</small>\n' +
            '   </div><div class="sq-input-container cvv" ng-class="{active:f.cvv}"><div id="sq-cvv"></div><label>CVV</label>\n' +
            '   <small style="display:block; margin-bottom:10px;" ng-show="errors.cvv" class="text-danger">{{errors.cvv}}</small>\n' +
            '   </div><div class="sq-input-container expirationDate" ng-class="{active:f.expirationDate}"><div id="sq-expiration-date"></div><label>Expiration Date</label>' +
            '   <small style="display:block; margin-bottom:10px;" ng-show="errors.expirationDate" class="text-danger">{{errors.expirationDate}}</small>\n' +
            '   </div><div class="sq-input-container postalCode" ng-class="{active:f.postalCode}"><div id="sq-postal-code"></div><label>Postal Code</label>\n' +
            '   <small style="display:block; margin-bottom:10px;" ng-show="errors.postalCode" class="text-danger">{{errors.postalCode}}</small>\n' +
            '   </div><small style="display:block; margin-bottom:10px;" ng-show="errors.request" class="text-danger">{{errors.request}}</small>\n' +
            '      <button ng-if="!externalControl" class="btn btn-flat btn-primary pull-right" ' +
            '       type="button" ng-click="requestCardNonce()">Submit</button>\n' +
            '    </div>',
            replace:true,
            scope : {
                'nonceReceivedCallback' : '=',
                'externalControl' : '=?',
                'inputStyles' : '=?',
                'inputConfigOverrides': '=?'
            },
            link:function($scope){

              $scope.f = {};

              var sandboxId ="sandbox-sq0idp-Ix0BKq70y9xTbYuMuBPZkQ";
              var applicationId = 'sq0idp-Ix0BKq70y9xTbYuMuBPZkQ'; // <-- Add your application's ID here
              //applicationId = sandboxId; //Comment out to go live..

              var sandboxLocation = 'CBASEN9Li-GLHOlc4cpGQaL58MogAQ';
              var locationId = '9PZNFDJTA6SQ4';
              //locationId = sandboxLocation; //Comment out to go live

              $scope.requestCardNonce = function() {
                $scope.errors ={};
                $scope.paymentForm.requestCardNonce();
              };

              if ($scope.externalControl) {
                $scope.externalControl = $scope.requestCardNonce;
              }

                // Credit card payments are always supported, but the Web Apple Pay
                // button should only display if Apple Pay is supported for this
                // domain. Apple Pay support is determined by the SqPaymentForm library
                // when the page loads. You do not need to modify this function..
                $scope.methodsSupported = function (methods) {
                  if (methods.applePay === true) {
                    // Show apple pay button
                    var element = document.getElementById('sq-apple-pay');
                    element.style.display = 'inline-block';
                  }
                };

                // createPaymentRequest is triggered when the Apple Pay button is
                // clicked. The payment request object is used by digital wallets
                // (like Apple Pay) to create their equivalent of a credit card nonce.
                // NOTE: The payment request below is provided as guidance. You should
                // add code to create the object programmatically.
                $scope.createPaymentRequest = function () {
                  return {
                    requestShippingAddress: true,
                    currencyCode: "USD",
                    countryCode: "US",
                    total: {
                      label: "{{ MERCHANT NAME }}",
                      amount: "{{TOTAL AMOUNT}}",
                      pending: false,
                    },
                    lineItems: [
                      {
                        label: "Subtotal",
                        amount: "{{SUBTOTAL AMOUNT}}",
                        pending: false,
                      },
                      {
                        label: "Shipping",
                        amount: "{{SHIPPING AMOUNT}}",
                        pending: true,
                      },
                      {
                        label: "Tax",
                        amount: "{{TAX AMOUNT}}",
                        pending: false,
                      }
                    ]
                  };
                };


              // Used for credit card payments. Called when the SqPaymentForm
                // completes a request to generate a card nonce, even if the request
                // failed because of an error.
                $scope.cardNonceResponseReceived = function(errors, nonce, cardData) {
                  if (errors) {
                    errors.forEach(function(error) {
                      $scope.errors[error.field] = error.message;
                    });
                    $scope.$apply();
                    return;
                  }

                  //If no errors.. proceed with callback chain
                  $scope.nonceReceivedCallback(nonce, function(err){
                    $scope.errors.request=err.message;
                  });

                };

                // Fill in this callback to alert buyers when their browser is not supported.
                $scope.unsupportedBrowserDetected = function() {
                  console.log("unsupported browser");
                };

                // Fill in these cases to respond to various events that can occur while a
                // buyer is using the payment form.
                $scope.inputEventReceived = function(inputEvent) {
                    switch (inputEvent.eventType) {
                        case 'focusClassAdded':
                            // Handle as desired
                            break;
                        case 'focusClassRemoved':
                            // Handle as desired
                          $scope.f[inputEvent.field] = true;
                          $scope.$apply();
                          break;
                        case 'errorClassAdded':
                            // Handle as desired
                            break;
                        case 'errorClassRemoved':
                            // Handle as desired
                            break;
                        case 'cardBrandChanged':
                            // Handle as desired
                            break;
                        case 'postalCodeChanged':
                            // Handle as desired
                            break;
                    }
                };

                $scope.paymentFormLoaded = function() {
                    // Fill in this callback to perform actions after the payment form is
                    // done loading (such as setting the postal code field programmatically).
                    // paymentForm.setPostalCode('94103');
                };


                //Setup Default input styles
                if (!$scope.inputStyles) {
                  $scope.inputStyles = [
                    {
                      backgroundColor: '#FFFFFF',
                      padding: '6px 12px',
                      fontSize: '14px',
                      lineHeight: '18px'
                    }
                  ];
                };


                var sqInputConfig = {
                  cardNumber: {
                    elementId: 'sq-card-number',
                    placeholder: '•••• •••• •••• ••••'
                  },
                  cvv: {
                    elementId: 'sq-cvv',
                    placeholder: 'CVV'
                  },
                  expirationDate: {
                    elementId: 'sq-expiration-date',
                    placeholder: 'MM/YY'
                  },
                  postalCode: {
                    elementId: 'sq-postal-code'
                  },
                  applePay:{
                    elementId:'sq-apple-pay'
                  }
                };


                if($scope.inputConfigOverrides){
                  for (var k in $scope.inputConfigOverrides) {
                    if ($scope.inputConfigOverrides.hasOwnProperty(k)) {
                      var itemName = k;
                      var itemConfig = $scope.inputConfigOverrides[k];
                      for(ov in itemConfig){
                        if (itemConfig.hasOwnProperty(ov)) {
                          sqInputConfig[itemName][ov] = itemConfig[ov];
                        }
                      }
                    }
                  }
                }

                // Create and initialize a payment form object
                $scope.paymentForm = new SqPaymentForm({
                  applicationId: applicationId,
                  locationId: locationId,
                  inputClass: "sq-input",
                  inputStyles: $scope.inputStyles,
                  cardNumber: sqInputConfig.cardNumber,
                  cvv: sqInputConfig.cvv,
                  expirationDate:sqInputConfig.expirationDate,
                  postalCode:sqInputConfig.postalCode,
                  applePay: sqInputConfig.applePay,
                  callbacks: {
                    methodsSupported: $scope.methodsSupported,
                    cardNonceResponseReceived: $scope.cardNonceResponseReceived,
                    unsupportedBrowserDetected: $scope.unsupportedBrowserDetected,
                    inputEventReceived: $scope.inputEventReceived,
                    paymentFormLoaded: $scope.paymentFormLoaded,
                    createPaymentRequest: $scope.createPaymentRequest
                  }
                });

                $scope.$evalAsync(function() {
                  $scope.paymentForm.build();
                } );

            }
        }

    }

})();