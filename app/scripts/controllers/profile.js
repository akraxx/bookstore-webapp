'use strict';

angular.module('bookstoreWebapp')
  .controller('ProfileCtrl', function ($scope, $http, toaster) {
    $scope.oldPassword = '';
    $scope.newPassword = '';
    $scope.newPasswordRepeat = '';

    $http.get('/api/user/me')
      .success(function (me) {
        $scope.profile = me;
        $scope.profile.address = {};
        if (me.mailingAddressId) {
          $http.get('/api/mailingAddress/' + me.mailingAddressId).success(function (myAddress) {
            $scope.profile.address = myAddress;
          });
        }
      });

    $scope.updateEmail = function () {
      $http.put('/api/user/updateEmail', $scope.profile.email)
        .success(function () {
          toaster.pop('success', 'Email has been updated', 'Your email has been updated.', 5000, 'trustedHtml');
        });
    };

    $scope.updatePassword = function () {
      $http.put('/api/user/updatePassword', $scope.newPassword)
        .success(function () {
          toaster.pop('success', 'Password has been updated', 'Your password has been updated.', 5000, 'trustedHtml');
        });
    };

    $scope.updateAddress = function () {
      $http.put('/api/mailingAddress', $scope.profile.address)
        .success(function () {
          toaster.pop('success', 'Address updated', 'Your address has been updated.', 5000, 'trustedHtml');
        })
        .error(function (data) {

          if (data.errors) {
            var errors = '<ul>';
            angular.forEach(data.errors, function (value) {
              errors += '<li>' + value + '</li>';
            }, errors);
            errors += '</ul>';
            toaster.pop('error', 'Error', 'Error(s) occurred during the registration : ' + errors, 0, 'trustedHtml');
          }

        });
    };

    $scope.checkPassword = function () {
      $scope.isErrorPwdRepeat = ($scope.newPasswordRepeat !== $scope.newPassword);
    };

    $scope.checkOldPassword = function () {
      $scope.isErrorOldPwd = ($scope.profile.password !== $scope.oldPassword);
    };
  });
