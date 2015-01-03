'use strict';

angular.module('bookstoreWebapp')
  .controller('OrdersCtrl', function ($scope, $http) {
    $http.get('/api/order/mine')
      .success(function (orders) {
        $scope.orders = orders;
        angular.forEach(orders, function(order) {
          if (order.mailingAddressId) {
            $http.get('/api/mailingAddress/' + order.mailingAddressId).success(function (orderAddress) {
              order.address = orderAddress;
            });
          }

          order.total = 0;
          order.articles = 0;
          $http.get('/api/orderLine/byOrder/' + order.id).success(function (lines) {
            order.lines = lines;
            angular.forEach(lines, function(line) {
              $http.get('/api/book/' + line.bookIsbn13).success(function (book) {
                order.total += parseFloat(book.unitPrice) * parseInt(line.quantity);
                order.articles += parseInt(line.quantity);
                line.book = book;
                if(book.authorId) {
                  $http.get('/api/author/' + book.authorId).success(function (author) {
                    book.author = author;
                  });
                }
              });
            });
          });
        });
      });
  });
