'use strict';

angular.module('inspinia')
  .controller('FitMatchEditController', ['$timeout', '$filter', '$q', '$scope', 'fmData', 'toaster', '$uibModal','api', 'user', '$state', 'SweetAlert',
    function ($timeout, $filter, $q, $scope, fmData, toaster, $uibModal, api, user, $state, SweetAlert) {

      var vm = this;
      vm.user = user.get();
      vm.data = api.getData();

      $scope.f = {};


      var newFMData = {
        requested_fabric_ids:[],
        shipped_date:null,
        form_received_date:null
      };
      vm.newFM = fmData===null;
      vm.fmData = vm.newFM ? newFMData : fmData;
      vm.EditMode= !!vm.newFM;

      if(!vm.newFM) vm.fmData.requested_fabric_ids = JSON.parse(vm.fmData.requested_fabric_ids);

      vm.pullingCards = false;
      if(vm.fmData.credit_card_id && vm.fmData.user.square_id){
        vm.pullingCards = true;
        api.call('usersGetUserCreditCards', vm.fmData.user.id, function (cards) {
          vm.pullingCards = false;
          vm.fmData.user.cards = cards;
          for(var i=0; i < cards.length; i++){
            if (cards[i].id == vm.fmData.credit_card_id){
              vm.fmData.primary_card = cards[i];
              break;
            }
          }
        });
      }

      vm.beginEdit = function(){
        vm.EditMode = true;
        vm.BeforeEdit = angular.copy(vm.fmData);
      };

      vm.clearEdit = function(){
        vm.EditMode = false;
        vm.fmData = angular.copy(vm.BeforeEdit);
      };

      vm.removeFabric = function(index){
        vm.fmData.requested_fabric_ids.splice(index, 1);
      };

      vm.fabricNotChosen = function(){
        return function( item ) {
          return vm.fmData.requested_fabric_ids.indexOf(""+item.id) < 0;
        };
      };



      /*
      |--------------------------------------------------------------------------
      | User Choice
      |--------------------------------------------------------------------------
      */

      vm.editUser = function(){
        var modalInstance = $uibModal.open({
          templateUrl: 'app/components/user-choice/userChoice.html',
          controller: 'UserChoiceController',
          resolve: {
            choose : function(){
              return vm.chooseClient;
            },
            orderUser : function() {
              return vm.fmData.user;
            },
            api : function() {
              return api;
            }
          }
        });
      };

      vm.chooseClient = function(client){
        api.call('userGet', client.id, function(result){
          vm.fmData.user = result;
          vm.fmData.user_id = result.id;
          var primary = getPrimaryAddress(result.addresses);
          if (primary){
            vm.fmData.address = primary;
            vm.fmData.shipping_address_id=primary.id;
          }else{
            vm.fmData.address = null;
            vm.fmData.shipping_address_id=null;
          }
        });
      };
  
  
      $scope.$watch(angular.bind(this, function () {
        return this.fmData.user;
      }), function (newVal, oldVal) {
        if(!vm.newFM) return false;
        if(newVal && !oldVal || newVal.id && newVal.id !== oldVal.id){
          vm.fmData.shipping_phone = newVal.phone;
        }
      });
      
      function getPrimaryAddress(addresses){
        if(!addresses || !addresses.length) return false;
        for (var i=0; i<addresses.length; i++) {
          if (addresses[i].primary == true) return addresses[i];
        }
        return addresses[0];
      }



      /*
      |--------------------------------------------------------------------------
      | Address Choice
      |--------------------------------------------------------------------------
      */

      vm.editAddress = function (type, icon) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/components/address-choice/address.html',
          controller: 'AddressController',
          resolve: {
            data: {
              addressType : type,
              icon : icon,
              selected:vm.fmData.shipping_address_id
            },
            save : function(){
              return vm.saveAddress;
            },
            address: function () {
              return vm.fmData.user.addresses;
            }
          }
        });
      };


      vm.saveAddress = function(add, callback){
        if (add === parseInt(add, 10)){
          vm.fmData.shipping_address_id = add;
          for (var i=0; i<vm.fmData.user.user.addresses.length; i++){
            var thisAdd = vm.fmData.user.addresses[i];
            if (thisAdd.id == add) vm.fmData.address=thisAdd;
          }
          if(callback)callback();
        }
        else{
          var data = {userId:vm.fmData.user.id, address:add};
          api.call('postAddress', data, function(result){
            vm.fmData.address = result;
            vm.fmData.user.addresses.push(result);
            vm.fmData.shipping_address_id = result.id;
            if(callback)callback();
          });
        }
      };





      /*
      |--------------------------------------------------------------------------
      | CC Modal
      |--------------------------------------------------------------------------
      */


      vm.captureCC = function(){

        var modalInstance = $uibModal.open({
          templateUrl: 'app/components/key-in-cc/keyInModal.html',
          controller: 'KeyInController',
          resolve: {
            orderData : function() {
              var data = {
                "user":vm.fmData.user,
                "fitmatch":vm.fmData,
                "amount":50
              };
              if (vm.fmData.credit_card_id) data.selectedCard = vm.fmData.credit_card_id;
              return data;

            },
            api : function(){
              return api;
            },
            confirmation : function(){
              return function(swalSettings){
                SweetAlert.swal(swalSettings);
              };
            }
          }
        });
      };




      /*
      |--------------------------------------------------------------------------
      | Save / Create
      |--------------------------------------------------------------------------
      */

      var deleteOrderBox = {
        title: "Are you sure?",
        text: "This Fit Match Request will be deleted forever and you will be redirected to the Fit Match list!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
      };

      vm.deleteFM = function(){
        SweetAlert.swal(deleteOrderBox,
          function (isConfirm) {
            if (isConfirm) {
              api.call('fitmatchDelete', vm.fmData.id, function(result){
                $state.transitionTo('fitmatch.list');
              });
            }
          }
        );
      };

      vm.orderFM = function(){
        $state.transitionTo('orders.add', {fitMatchId:vm.fmData.id});
      };

      //Save...
      vm.saveFM = function(callback){

        if (!$scope.f.fmForm.$valid){
          $scope.f.fmForm.submitted = true;
          return false;
        }

        if(vm.fmData.user===null){
          console.log("We don't have a user yet!");
          return false;
        }

        var savingToast = toaster.pop({
          type: 'wait',
          title: "Saving...",
          timeout: 9000000
        });

        var saveData = angular.copy(vm.fmData);
        saveData.requested_fabric_ids=JSON.stringify(saveData.requested_fabric_ids);

        api.call('fitmatchPost', saveData, function(result){
          toaster.clear(savingToast);
          toaster.success('Saved Fit Match Request!');
          $state.transitionTo('fitmatch.edit', {fmId:result.id});
          if (callback)callback();
        }, function(err){
          toaster.clear(savingToast);
          toaster.pop({
            type: 'error',
            title: "Problem saving Fit Match Request..",
            timeout: 2000
          });
        });

      };//.saveOrder()...

      vm.formatDate = function(date){
        var fdate = new Date(date);
        return $filter('date')(fdate, "MM/dd/yyyy h:s a");
      };

      $scope.$watch(angular.bind(this, function () {
        return this.fmData.shipped_date;
      }), function (newVal) {
        if (newVal && newVal._d){
          var d = newVal._d.toISOString().slice(0,10);
          vm.fmData.shipped_date = d;
        }
      });

      $scope.$watch(angular.bind(this, function () {
        return this.fmData.form_received_date;
      }), function (newVal) {
        if (newVal && newVal._d){
          var d = newVal._d.toISOString().slice(0,10);
          vm.fmData.form_received_date = d;
        }
      });

      console.log(vm.data.fabrics);
      vm.fabric_list_item_name = function(fabric_id){
        var name = vm.data.lookup("fabrics", "id", fabric_id, "name");
        var id = vm.data.lookup("fabrics", "id", fabric_id, "display_id");
        var ret = "";
        if(vm.data.lookup("fabrics", "id", fabric_id, "deleted_at"))
          ret+="(deleted) ";
        ret+=name;
        if (id) ret+=" - "+id;
        return ret;
      }

  }]);
