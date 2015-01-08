'use strict';

angular.module('bookstoreWebapp')
  .controller('CartCtrl', function ($scope, $rootScope, $http, CartService) {
    $scope.cartTotalPrice = function() {
      return CartService.totalPrice();
    };

    $scope.cartTotalBooks = function() {
      return CartService.totalBooks();
    };

    $scope.removeLine = function(line) {
      CartService.removeLine(line);
    };

  });
