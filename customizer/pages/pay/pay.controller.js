(function() {
  
  angular
    .module('bdApp')
    .controller('payCtrl', payCtrl);

    payCtrl.$inject = ['messages','$scope', '$routeParams', 'user', 'api', 'apiData', '$location'];
  
  
  
  
  function payCtrl (messages, $scope, $routeParams, user, api, apiData, $location) {
    
    
    var vm = this;
    vm.messages = messages.get();
    vm.userLoggedIn = user.isLoggedIn();
    vm.user = user.get();
    vm.user.loaded = !vm.userLoggedIn;
    vm.orderErr = false;
    vm.checkoutForm = {};
    vm.data = apiData;
    vm.user = user.get();
    vm.add = {};
    vm.formStep=1;
    vm.paidDate = false;
    vm.cards = null;
    vm.cardForm = {
      addingCard:false,
      loadingCards:true
    };
    
    vm.authCallback = function(){
      console.log("AUTH");
      vm.orderLoaded = false;
      vm.user=user.get();
      vm.userLoggedIn = user.isLoggedIn();
      vm.initPage();
    };
    
    vm.logout = function(){
      user.logout(function(){
        vm.orderErr = false;
        vm.user = {};
        vm.user.loaded=true;
        vm.userLoggedIn = user.isLoggedIn();
      }, false)
    };
    
    vm.fire = function(){};
    
    //After User is init'd//
    $scope.$watch(function() {
      return vm.user;
    }, function(current, original) {
      
      //Make sure we've pulled a user...
      if(!vm.user.id) return false;
      //Only run this once..
      if(vm.user.loaded) return false;
      vm.user.loaded = true;
      //Set primary address to shipping address
      if(vm.user.addresses.length){
        for(i=0; i<vm.user.addresses.length; i++){
          if(vm.user.addresses[i].primary){
            vm.add = vm.user.addresses[i];
            break;
          }
        }
      }
      
      //Pull Credit Cards
      if(current.square_id){
        vm.cardForm.loadingCards = true;
        api.call('getMyCreditCards', null, function(cards){
          if (cards.length<1){
            vm.cardForm.addingCard=true;
          }else{
            vm.cards = cards;
          }
          vm.cardForm.loadingCards = false;
        });
      }else if(current.id && !current.square_id){
        vm.cardForm.addingCard=true;
        vm.cardForm.loadingCards=false;
      }
    }, true);
    //After User is init'd//
    
    
    
    vm.inputConfigOverrides = {
      cardNumber: {placeholder: ''},
      cvv: {placeholder: ''},
      expirationDate: {placeholder: ''},
    };
    
    vm.inputStyles = [
      {
        backgroundColor: '#e8edef',
        padding: '10px',
        fontSize: '20px',
        lineHeight: '20px',
      }
    ];
    
    
    //Create CC from nonce and place order
    vm.nonceReceived =  function(nonce, err){
      api.call('createMyCreditCard', {'nonce':nonce}, function(card){
        vm.payInvoice(card.card_id);
      });
    };
    
    
    
    vm.payInvoice = function(card){
      var chargeObject = {
        "orderId":vm.order.id,
        "customer_card_id":card,
        "amount_money":vm.checkoutForm.price,
        "customer_id":vm.user.square_id
      };
      console.log(chargeObject);
      api.call('ordersCharge', chargeObject, function(){
        $location.path('/thank-you/order');
      });
    };
  
    vm.initPage = function() {
      vm.orderId = $routeParams.orderDetails;
      api.call('getMyOrders', $routeParams.orderDetails, function (result) {
        if (result.price) {
          vm.order = result;
          if (result.payment_status_id==3){
            vm.orderErr = "This order has been comped";
            vm.orderLoaded = true;
          }
          else if(result.payment_status_id !== 1 && result.transactions) {
            for (var i = 0; i < result.transactions.length; i++) {
              if (result.transactions[i].status === "ok") {
                vm.paidDate = new Date(result.transactions[i].created_at);
                break;
              }
            }
          }
          vm.checkoutForm.price = result.price;
          vm.orderLoaded = true;
        }
        else {
          vm.orderErr = "Sorry, but this order is not ready for payment";
          vm.orderLoaded = true;
        }
      }, function (err) {
        vm.orderLoaded = true;
        if (err.status == 404) {
          vm.orderErr = "Sorry, but you don't have an Order #" + $routeParams.orderDetails;
        }
      });
    }
    //Get Order
    if(vm.userLoggedIn) {
      vm.initPage();
    }else{
      vm.orderLoaded = true;
    }
    
    
    
  }
})();