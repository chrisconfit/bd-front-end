//
'use strict';

angular.module('inspinia')
    .controller('OrdersCallbackController', ['$state', '$location','api',
      function ($state, $location, api) {
        var data = JSON.parse($location.search().data);
        if (!data){
          $state.transitionTo('orders.list');
        }
        api.call("swipeCallback", data, function(result){
          $state.transitionTo('orders.edit', {orderId:result.id});
        });
      }]);
