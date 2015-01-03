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
    $scope.technologiesFront = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'CSS 3',
      'Bootstrap',
      'ng-table',
      'toaster'
    ];

    $scope.technologiesBack = [
      'Jersey',
      'JPA',
      'Hibernate',
      'Jackson',
      'Jetty',
      'Guice',
      'Dropwizard'
    ];
  });
