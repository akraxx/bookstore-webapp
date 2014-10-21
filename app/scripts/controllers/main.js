'use strict';

/**
 * @ngdoc function
 * @name bookstoreWebappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bookstoreWebappApp
 */
angular.module('bookstoreWebapp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
