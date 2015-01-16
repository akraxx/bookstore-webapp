'use strict';

angular.module('bookstoreWebapp')
  .controller('CartCtrl', function ($scope, $localStorage, $http, CartService, $modal) {

    $scope.cart = $localStorage.cart;

    $scope.cartTotalPrice = function() {
      return CartService.totalPrice();
    };

    $scope.cartTotalBooks = function() {
      return CartService.totalBooks();
    };

    $scope.removeLine = function(line) {
      CartService.removeLine(line);
    };

    $scope.processOrder = function (totalPrice) {
      $modal.open({
        templateUrl: 'modalProcessOrder.html',
        controller: 'ProcessOrderCtrl',
        size: 'lg',
        resolve: {
          totalPrice: function () {
            return totalPrice;
          }
        }
      });
    };



  })
  .controller('ProcessOrderCtrl', function ($scope, $localStorage, $modalInstance, $http, totalPrice, toaster, $location) {
    $scope.totalPrice = totalPrice;
    $scope.cart = $localStorage.cart;
    $scope.savedProfileAddress = {};

    $http.get('/api/user/me')
      .success(function (me) {
        $scope.profile = me;
        $scope.profile.address = {};
        if (me.mailingAddressId) {
          $http.get('/api/mailingAddress/' + me.mailingAddressId).success(function (myAddress) {
            myAddress.id = 0;
            $scope.profile.address = myAddress;
            angular.copy($scope.profile.address, $scope.savedProfileAddress);
          });
        }
      });

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.useProfileAddress = function(useProfile) {
      if(useProfile) {
        var tempAddress = {};
        angular.copy($scope.savedProfileAddress, tempAddress);
        $scope.profile.address = tempAddress;
      } else {
        $scope.profile.address = {};
      }
    };

    $scope.processOrder = function() {
      var orderLines = [];
      angular.forEach($localStorage.cart, function(line) {
        orderLines.push({
          bookIsbn13: line.book.isbn13,
          quantity: line.quantity
        });
      });


      $http.post('/api/order',
        {
          address: $scope.profile.address,
          orderLines: orderLines
        })
        .success(function () {
          toaster.pop('success', 'Success', 'Order has been successfully processed.', 5000, 'trustedHtml');
          $localStorage.cart = {};
          $modalInstance.dismiss('cancel');
          $location.path('/orders');
        })
        .error(function (data) {

          if (data.errors) {
            var errors = '<ul>';
            angular.forEach(data.errors, function (value) {
              errors += '<li>' + value + '</li>';
            }, errors);
            errors += '</ul>';
            toaster.pop('error', 'Error', 'Error(s) occurred during the order process : ' + errors, 0, 'trustedHtml');
          }

        });
    };
  });
