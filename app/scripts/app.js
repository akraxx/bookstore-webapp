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
    'ui.bootstrap',
    'toaster'
  ])
    .constant('API_URL', '/api')
    .factory('NgTableParams', function (ngTableParams) {
        return ngTableParams;
    })
    .factory('httpRequestInterceptor', function (SessionService) {
        var sessionInjector = {
            request: function(config) {
                if(!SessionService.isAnonymous()) {
                    config.headers.Authorization = 'Bearer ' + SessionService.getToken();
                }

                return config;
            }
        };
        return sessionInjector;
    })
    .service('SessionService', function($cookieStore) {
        var token = null;
        var pageAuthentificationNeeded = null;

        if($cookieStore.get('login')) {
            token = $cookieStore.get('login');
        }

        this.isAnonymous = function() {
            return !token;
        };

        this.login = function(clientToken, cookie) {
            if(cookie) {
                $cookieStore.put('login', clientToken);
            }
            token = clientToken;
        };

        this.logout = function() {
            $cookieStore.put('login', null);
            token = null;
        };

        this.getToken = function() {
            return token;
        };

        this.needAuthentification = function(page) {
            pageAuthentificationNeeded = page;
        };

        this.comeFromPrivatePage = function() {
            return pageAuthentificationNeeded;
        };


    })
    .controller('PageCtrl', function($scope, $location, $http, SessionService) {
        $scope.loggedIn = false;

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.loggedIn = function() {
            return !SessionService.isAnonymous();
        };

        $scope.logout = function() {
            SessionService.logout();
        };

        $scope.$watch('$viewContentLoaded', function(){
            $scope.pageLoaded = true;
        });
    })
    .provider('FooService', function(){
        this.filter = function(SessionService, $q, $location, toaster, page) {
            if (SessionService.isAnonymous() === false) { // fire $routeChangeSuccess
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            } else { // fire $routeChangeError
                toaster.pop('warning', 'Authentification', 'You need to be authenticated to access to the page ' + page, 0);
                SessionService.needAuthentification(page);
                $location.path('/login');
            }
        };

        this.$get = function() {

        };
    })
    .config(function($routeProvider, $locationProvider, $httpProvider, FooServiceProvider) {
        $locationProvider.hashPrefix('!');

        $httpProvider.interceptors.push('httpRequestInterceptor');

//        var requireAuthentication = function (page) {
//            return {
//                load: function (SessionService, $q, $location, toaster) {
//                    if (SessionService.isAnonymous() === false) { // fire $routeChangeSuccess
//                        var deferred = $q.defer();
//                        deferred.resolve();
//                        return deferred.promise;
//                    } else { // fire $routeChangeError
//                        toaster.pop('warning', 'Authentification', 'You need to be authenticated to access to the page ' + page, 0);
//                        SessionService.needAuthentification(page);
//                        $location.path('/login');
//                    }
//                }
//            };
//        };

        $routeProvider
            .when('/', {
                controller:'MainCtrl',
                templateUrl:'../views/main.html'
            })
            .when('/books', {
                controller:'BookCtrl',
                templateUrl:'../views/book.html',
                resolve: {
                    load: function (SessionService, $q, $location, toaster) {
                        FooServiceProvider.filter(SessionService, $q, $location, toaster, '/books');
                    }
                }
            })
            .when('/login', {
                controller:'AuthCtrl',
                templateUrl:'../views/login.html'
            })
            .when('/register', {
                controller:'RegisterCtrl',
                templateUrl:'../views/register.html'
            })
            .otherwise({
                redirectTo:'/'
            });


    });


