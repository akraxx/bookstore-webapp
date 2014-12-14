'use strict';

angular.module('bookstoreWebapp')
    .controller('AuthCtrl', function ($scope, $http, SessionService, $location, $timeout, toaster) {
        $scope.username = '';
        $scope.password = '';

        $scope.login = function() {
            $http.post('/api/user/authenticate',
                    'username='+$scope.username+'&password='+$scope.password,
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
                )
              .success(function(data) {
                    toaster.pop('success', 'Logged', 'Welcome ' + $scope.username, 5000);
                    SessionService.login(data, $scope.username, true);

                    if (SessionService.comeFromPrivatePage()) {
                        $location.path(SessionService.comeFromPrivatePage());
                    } else {
                        $location.path('/');
                    }
                })
              .error(function(data, status) {
                    switch(status) {
                        case 401:
                            toaster.pop('error', 'Error', 'Your username/password are not correct. Please verify it and try again.', 15000);
                            break;
                        default:
                            toaster.pop('error', 'Error', 'An error occurred during the authentification. Please try again.', 15000);
                            break;
                    }
                });
        };
    });
