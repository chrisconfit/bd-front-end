'use strict';

angular.module('inspinia')
.controller('KeyInController', ['$scope', '$uibModalInstance', 'orderData', 'api', 'confirmation',
  function ($scope, $uibModalInstance, orderData, api, confirmation) {
  
    $scope.cardForm = {
      chargeAmount:orderData.order.price,
      editingAmount:false,
      addCard:false,
      chargeExisting:false,
      saveCard:true,
      fire:function(){
        return false;
      }
    };

    $scope.closeForm = function(){
      $uibModalInstance.close();
    }

    //Find User's saved CC
    if(orderData.user.square_id){
      api.call('usersGetUserCreditCards', orderData.user.id, function(cards){
        $scope.cards=cards;
        $scope.cardsSearched = true;
      });
    }else{
      $scope.cardForm.addCard = true;
      $scope.cardsSearched = true;
    }


    //Responses, Utility, etc...
    function handleCCErr(err){
      console.log("handleCCErr...");
    }

    function successfulTransaction(details){
      console.log(details);
      orderData.order.payment_status_id = details.order.payment_status_id;
      var paymentProcessedBox = {
        title: "Payment has been processed",
        text: "The customer's payment has been posted.",
        type: "success"
      }
      $uibModalInstance.close();
      confirmation(paymentProcessedBox);
    }

    function chargeCard(cardData, callback){
      api.call('ordersCharge', cardData, successfulTransaction, handleCCErr);
    }



    $scope.cardChosen = function(ccCode) {

      var chargeData = {
        "amount_money": $scope.cardForm.chargeAmount,
        "userId": orderData.user.id,
        "orderId": orderData.order.id,
      };

      //Adding new CC..
      if ($scope.cardForm.addCard) {

        //Saving a card first
        if ($scope.cardForm.saveCard) {
          api.call('usersCreateCreditCard', {userId: orderData.user.id, nonce: ccCode},
              function (result) {
                chargeData.customer_id = result.customer_id;
                chargeData.customer_card_id = result.card_id;//Charge with newly created ccid...
                chargeData.customer_card_id = 'fake-customer-card-id-ok';//Sandbox...
                //TODO: REMOVE SANDBOX....
                chargeCard(chargeData);
              }, handleCCErr
          );
        }

        //Simple Charge
        else {
          //Charge with nonce...
          chargeData.card_nonce = ccCode;
          chargeData.card_nonce = 'fake-card-nonce-ok';//Sandbox...
          chargeCard(chargeData);
        }
      }

      //Charging Card on file
      else {
        chargeData.customer_card_id = ccCode;
        chargeData.customer_id  = orderData.user.square_id;
        chargeData.customer_card_id = 'fake-customer-card-id-ok';//Sandbox...
        api.call('ordersCharge', chargeData, successfulTransaction, handleCCErr);
      }

    };//$scope.cardChosen()...




  }]);