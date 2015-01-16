'use strict';

angular.module('bookstoreWebapp')
  .controller('BookCtrl', function ($scope, BookFactory, AuthorFactory, NgTableParams, $filter, $modal, $http) {

    var books = BookFactory.query();

    $scope.criterias = {};
    $scope.userCriterias = {};

    $scope.processNewBooks = function(books) {
      angular.forEach(books, function (book) {
        book.author = AuthorFactory.get({authorId: book.authorId});

        book.author.$promise.then(function (author) {
          book.author.fullName = author.lastName + ' ' + author.firstName;
        });
      });

      $scope.tableParams.reload();
    };

    books.$promise.then(function (books) {
      $scope.processNewBooks(books);
    });

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

    $scope.addCriteria = function(type, value) {
      $scope.userCriterias[type] = value;

      $scope.searchCriteria();
    };

    $scope.removeCriteria = function(type) {
      delete $scope.userCriterias[type];

      $scope.searchCriteria();
    };

    $scope.searchCriteria = function() {
      $http.post('/api/book/byCriterias', $scope.userCriterias)
        .success(function(books) {
          $scope.processNewBooks(books);
          $scope.books = books;
        })
        .error(function() {

        });

    };

    $http.get('/api/book/criterias')
      .success(function (data) {
        $scope.criterias = data;
      });

    $scope.isAnyUserCriterias = function() {
      return !angular.equals({}, $scope.userCriterias);
    };

    $scope.tableParams = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filterDelay: 0,
      filter: {
        isbn13: ''
      },
      sorting: {
        isbn13: 'asc'
      }
    }, {
      total: books.length, // length of data
      filterDelay: 300,
      getData: function ($defer, params) {

        // use build-in angular filter
        var orderedData = params.filter() ?
          $filter('filter')(books, params.filter()) :
          books;

        orderedData = params.sorting() ?
          $filter('orderBy')(orderedData, params.orderBy()) :
          orderedData;

        if ($scope.tableParams.operatorPrice && $scope.tableParams.limitPrice) {
          orderedData = $filter('price')(orderedData, $scope.tableParams.operatorPrice, $scope.tableParams.limitPrice);
        }

        $scope.books = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve($scope.books);
      }
    });

    $scope.reassessUnitPriceFilter = function () {
      $scope.tableParams.reload();
    };

    $scope.tableParams.operatorPrice = '';
    $scope.tableParams.limitPrice = 30;

  })
  .controller('DetailsBookCtrl', function ($scope, $modalInstance, book, CartService) {
    $scope.book = book;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.addToCart = function (quantity) {
      CartService.addLine(book, quantity);
      $modalInstance.dismiss('cancel');
    };
  })
  .filter('price', function () {
    return function (books, operator, price) {
      var result = [];
      angular.forEach(books, function (book) {
        if (operator === '>' && book.unitPrice > price) {
          result.push(book);
        } else if (operator === '<' && book.unitPrice < price) {
          result.push(book);
        } else if (operator === '=' && book.unitPrice === Number(price)) {
          result.push(book);
        }
      });
      return result;
    };
  });
