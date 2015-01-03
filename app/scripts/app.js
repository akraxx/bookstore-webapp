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
  .factory('httpRequestInterceptor', function (SessionService, $q, toaster, $location) {
    var sessionInjector = {
      request: function (config) {
        if (!SessionService.isAnonymous()) {
          config.headers.Authorization = 'Bearer ' + SessionService.getToken();
        }

        return config;
      },
      // optional method
      'responseError': function (rejection) {
        if (rejection.status === 401 && $location.path() !== '/login') {
          toaster.pop('error', 'Error occurred', rejection.data, 5000);

          SessionService.logout();
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
    return sessionInjector;
  })
  .service('SessionService', function ($cookieStore) {
    var token = null;
    var pageAuthentificationNeeded = null;
    var login = null;

    if ($cookieStore.get('login')) {
      token = $cookieStore.get('login');
    }

    this.isAnonymous = function () {
      return !token;
    };

    this.login = function (clientToken, userLogin, cookie) {
      if (cookie) {
        $cookieStore.put('login', clientToken);
      }
      token = clientToken;
      login = userLogin;
    };

    this.logout = function () {
      $cookieStore.put('login', null);
      token = null;
    };

    this.getToken = function () {
      return token;
    };

    this.getLogin = function () {
      return login;
    };

    this.needAuthentification = function (page) {
      pageAuthentificationNeeded = page;
    };

    this.comeFromPrivatePage = function () {
      return pageAuthentificationNeeded;
    };


  })
  .controller('PageCtrl', function ($scope, $location, $http, SessionService) {
    $scope.loggedIn = false;

    $scope.isActive = function (route) {
      return route === $location.path();
    };

    $scope.loggedIn = function () {
      return !SessionService.isAnonymous();
    };

    $scope.logout = function () {
      SessionService.logout();
    };

    $scope.$watch('$viewContentLoaded', function () {
      $scope.pageLoaded = true;
    });
  })
  .provider('SecureService', function () {
    this.filter = function (SessionService, $q, $location, toaster, page) {
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

    this.$get = function () {

    };
  })
  .config(function ($routeProvider, $locationProvider, $httpProvider, SecureServiceProvider) {
    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('httpRequestInterceptor');

    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: '../views/main.html'
      })
      .when('/books', {
        controller: 'BookCtrl',
        templateUrl: '../views/book.html',
        resolve: {
          load: function (SessionService, $q, $location, toaster) {
            SecureServiceProvider.filter(SessionService, $q, $location, toaster, '/books');
          }
        }
      })
      .when('/profile', {
        controller: 'ProfileCtrl',
        templateUrl: '../views/profile.html',
        resolve: {
          load: function (SessionService, $q, $location, toaster) {
            SecureServiceProvider.filter(SessionService, $q, $location, toaster, '/profile');
          }
        }
      })
      .when('/orders', {
        controller: 'OrdersCtrl',
        templateUrl: '../views/orders.html',
        resolve: {
          load: function (SessionService, $q, $location, toaster) {
            SecureServiceProvider.filter(SessionService, $q, $location, toaster, '/orders');
          }
        }
      })
      .when('/login', {
        controller: 'AuthCtrl',
        templateUrl: '../views/login.html'
      })
      .when('/register', {
        controller: 'RegisterCtrl',
        templateUrl: '../views/register.html'
      })
      .otherwise({
        redirectTo: '/'
      });


  });


