'use strict';

/**
 * @ngdoc overview
 * @name bookstoreWebappApp
 * @description
 * # bookstoreWebappApp
 *
 * Main module of the application.
 */
angular
  .module('bookstoreWebapp', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ngRoute',
    'ngResource',
    'ngTable',
    'ui.bootstrap'
  ])
    .constant('API_URL', 'http://localhost:9090/api')
    .factory('NgTableParams', function (ngTableParams) {
        return ngTableParams;
    })
    .controller('PageCtrl', function($scope, $location) {
        $scope.isActive = function(route) {
            return route === $location.path();
        }
    })
    .controller('BookCtrl', function ($scope, BookFactory, NgTableParams, $filter, $modal) {
        var books = BookFactory.query();

        $scope.openDetails = function (book, size) {
            $modal.open({
                templateUrl: 'modalBookDetails.html',
                controller: 'DetailsBookCtrl',
                size: size,
                resolve: {
                    book: function () {
                        return book;
                    }
                }
            });
        };

        $scope.tableParams = new NgTableParams({
            page: 1,            // show first page
            count: 5,          // count per page
            filter: {
                isbn13: ''       // initial filter
            }
        }, {
            total: books.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ?
                    $filter('filter')(books, params.filter()) :
                    books;

                orderedData = params.sorting() ?
                    $filter('orderBy')(orderedData, params.orderBy()) :
                    orderedData;

                $scope.books = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve($scope.books);
            }
        });


    })
    .controller('DetailsBookCtrl', function ($scope, $modalInstance, book) {
        $scope.book = book;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/', {
                controller:'MainCtrl',
                templateUrl:'../views/main.html'
            })
            .when('/books', {
                controller:'BookCtrl',
                templateUrl:'../views/book.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    });
