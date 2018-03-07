'use strict';

angular.module('inspinia')
.controller('KeyInController', ['$scope', '$uibModalInstance', 'orderData', 'api', 'confirmation',
  function ($scope, $uibModalInstance, orderData, api, confirmation) {
    
  
    /*
    *
    * Charge / Module Setup
    *
    */
    
    var chargeAmount = orderData.order ? orderData.order.price : 50;
    $scope.isFM = !orderData.order;
    $scope.isNewFM = $scope.isFM && (!orderData.fitmatch.id);
    $scope.orderType = orderData.order ? "order" : "fitmatch";
    $scope.cardForm = {
      chargeAmount:chargeAmount,
      editingAmount:false,
      addCard:false,
      selectedCard:orderData.selectedCard ? orderData.selectedCard : false,
      saveCard:true,
      chargeCard:true,
      fire:function(){
        return false;
      }
    };
    
    
    
    
    console.log($scope.cardForm);
    $scope.closeForm = function(){
      $uibModalInstance.close();
    };

    //If user comes through with cards, we'll use those...
    if (orderData.user.cards){
      $scope.cards = orderData.user.cards;
      $scope.cardsSearched = true;
    }
    else {
      //Otherwise... find User's saved CC
      if (orderData.user.square_id) {
        api.call('usersGetUserCreditCards', orderData.user.id, function (cards) {
          $scope.cards = cards;
          $scope.cardsSearched = true;
        });
      } else {
        $scope.cardForm.addCard = true;
        $scope.cardsSearched = true;
      }
    }
  
  
  
  
    /*
    *
    * SHARED UTILITY FUNCTIONS
    *
    */
    
    //Special handling for CC Error
    function handleCCErr(err){
      console.log("handleCCErr...");
    }
    
    //Call back for successful transaction
    function successfulTransaction(details){
      
      console.log(details);
      
      if(orderData.order) {
        orderData.order.payment_status_id = details.order.payment_status_id;
        if(orderData.order.order_status_id==5) orderData.order.order_status_id==4;
        var paymentProcessedBox = {
          title: "Payment has been processed",
          text: "The customer's payment has been posted.",
          type: "success"
        };
      }
  
      if(orderData.fitmatch) {
        orderData.fitmatch.paid_at = details.fitmatch.paid_at.date;
        var paymentProcessedBox = {
          title: "Payment has been processed",
          text: "The customer's payment has been posted and Fit Match has been cancelled.",
          type: "success"
        };
      }
      

      $uibModalInstance.close();
      confirmation(paymentProcessedBox);
    }
    
    //Handler for API calls to charge endpoints
    function runCharge(cardData){
      
      console.log(cardData);
      
      if (cardData.customer_card_id) orderData.credit_card_id = cardData.customer_card_id;
      var apiFunction = $scope.orderType === "fitmatch" ? "fitmatchCharge":"ordersCharge";
      api.call(apiFunction, cardData, successfulTransaction, handleCCErr);
    }
  
    //Main handler for when a card is . This is run when card from returns a nonce or when called directly with a customer card id.
    $scope.cardChosen = function(ccCode) {
      
      console.log($scope.cardForm.chargeCard);
      console.log($scope.cardForm.saveCard);
      
      //No actions chosen
      if (!$scope.cardForm.chargeCard && !$scope.cardForm.saveCard){
        console.log("No action chosen");
        return false;
      }
      
      //Init charge data object
      var chargeData = {
        "amount_money": $scope.cardForm.chargeAmount,
        "userId": orderData.user.id
      };
    
      //Save order id to charge data if we're paying for an order
      if(orderData.order) chargeData.orderId=orderData.order.id;
    
      //Save fitmatch id to charge data if we're paying for an fitmatch (and cancelling order)...
      if(orderData.fitmatch) chargeData.fitmatchId=orderData.fitmatch.id;
    
    
      //Opt 1: Adding new CC...
      if ($scope.cardForm.addCard) {
      
        //Saving a card first
        if ($scope.cardForm.saveCard) {
          api.call('usersCreateCreditCard', {userId: orderData.user.id, nonce: ccCode},
            function (result) {
              chargeData.customer_id = result.customer_id;
              chargeData.customer_card_id = result.card_id;//Charge with newly created ccid...
              //chargeData.customer_card_id = 'fake-customer-card-id-ok';//Sandbox...
              
              if ($scope.cardForm.chargeCard) runCharge(chargeData);
            }, handleCCErr
          );
        }
      
        //Simple Charge
        else {
          //Charge with nonce...
          chargeData.card_nonce = ccCode;
          //chargeData.card_nonce = 'fake-card-nonce-ok';//Sandbox...
          runCharge(chargeData);
        }
      }
    
      //Opt2: Charging Card on file...
      else {
        chargeData.customer_card_id = ccCode;
        chargeData.customer_id  = orderData.user.square_id;
        //chargeData.customer_card_id = 'fake-customer-card-id-ok';//Sandbox...
        runCharge(chargeData);
      }
  
      $scope.cardForm.chargeCard=true;
    
    };//$scope.cardChosen()...
    
    /*
    *
    * ORDERS ONLY
    *
    */
    
    $scope.handleOrderCharge = function(){
      if($scope.cardForm.addCard) $scope.cardForm.fire();
      else $scope.cardChose(cardForm.selectedCard);
    }
    
    /*
    *
    * FIT MATCH ONLY
    *
    */
    
    $scope.saveCCToUser = function(){
      $scope.cardForm.saveCard = true;
      $scope.cardForm.chargeCard = false;
      $scope.cardForm.fire();
    };
    
    //Save Card as Primary
    $scope.saveCardAsFmPrimary = function(ccCode){
      
      //Choose primary card data and pass to main controller
      for (var i=0; i<$scope.cards.length; i++){
        if ($scope.cards[i].id === ccCode){
          orderData[$scope.orderType].primary_card = $scope.cards[i];
          break;
        }
      }
      
      orderData[$scope.orderType].credit_card_id = ccCode;
      console.log(orderData);
      console.log($scope.orderType);
      //Build object to save just the chosen card
      var saveData = {
        id:orderData[$scope.orderType].id,
        credit_card_id:ccCode
      };
      
      //Check to make sure we're not creating a new fitmatch.
      if (orderData[$scope.orderType].id) {
        api.call('fitmatchPost', saveData, function () {
          $uibModalInstance.close();
          confirmation({
            title: "Card has been chosen!",
            text: "This card has been chosen as the primary source of payment for this order.",
            type: "success"
          }, ccCode);
        });
      }else{
        $uibModalInstance.close();
        confirmation({
          title: "Card has been chosen!",
          text: "This card has been chosen as the primary source of payment for this order.",
          type: "success"
        }, ccCode);
      }
  
    };
  
  
    
    




  }]);