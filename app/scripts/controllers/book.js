'use strict';

angular.module('bookstoreWebapp')
    .controller('BookCtrl', function ($scope, BookFactory, AuthorFactory, NgTableParams, $filter, $modal) {

        var books = BookFactory.query();

        books.$promise.then(function(books) {
            angular.forEach(books, function(book) {
                book.author = AuthorFactory.get({authorId:book.authorId});
            });
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
    });