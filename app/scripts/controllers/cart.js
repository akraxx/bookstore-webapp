'use strict';

angular.module('bookstoreWebapp')
  .controller('CartCtrl', function ($scope, $rootScope, $http, CartService, $modal) {


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
  .controller('ProcessOrderCtrl', function ($scope, $rootScope, $modalInstance, $http, totalPrice) {
    $scope.totalPrice = totalPrice;
    $scope.savedProfileAddress = {};

    $http.get('/api/user/me')
      .success(function (me) {
        $scope.profile = me;
        $scope.profile.address = {};
        if (me.mailingAddressId) {
          $http.get('/api/mailingAddress/' + me.mailingAddressId).success(function (myAddress) {
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
  });
