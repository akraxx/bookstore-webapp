'use strict';

angular.module('bookstoreWebapp')
    .controller('RegisterCtrl', function ($scope, $http, toaster, $location) {
        $scope.username = '';
        $scope.password = '';
        $scope.email = '';
        $scope.emailRepeat = '';
        $scope.isErrorMailRepeat = false;
        $scope.errorMailRepeat = 'E-Mails are not equals.';

        $scope.register = function() {


            $http.post('/api/user/',
                {
                    login: $scope.username,
                    password: $scope.password,
                    email: $scope.email
                }
            )
                .success(function() {
                    toaster.pop('success', 'Registered', 'You have been registered successfully with the username ' + $scope.username, 15000);
                    $location.path('/login');
                }).
                error(function(data) {

                    if(data.errors) {
                        var errors = '<ul>';
                        angular.forEach(data.errors, function(value) {
                            errors += '<li>' + value + '</li>';
                        }, errors);
                        errors += '</ul>';
                        toaster.pop('error', 'Error', 'Error(s) occurred during the registration : ' + errors, 0, 'trustedHtml');
                    }

                });
        };

        $scope.checkEmail = function() {
            $scope.isErrorMailRepeat = ($scope.emailRepeat !== $scope.email);
        };



    });