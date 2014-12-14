'use strict';

angular.module('bookstoreWebapp')
    .controller('ProfileCtrl', function ($scope, $http, toaster) {
        $http.get('/api/user/me')
            .success(function(me) {
                $scope.profile = me;
                $http.get('/api/mailingAddress/'+me.mailingAddressId).success(function(myAddress) {
                    $scope.profile.address = myAddress;
                });
            });

        $scope.submit = function() {
            console.log($scope.profile);
            $http.put('/api/user/updateEmail', $scope.profile.email)
              .success(function() {
                toaster.pop('success', 'Profile updated', 'Your profile has been updated.', 5000, 'trustedHtml');
              })
              .error(function(data, status) {
                if(status === 304) {
                  toaster.pop('warning', 'No changes', 'No changes have been found.', 5000, 'trustedHtml');
                }
              });
        };
    });
