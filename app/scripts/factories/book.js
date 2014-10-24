'use strict';

angular.module('bookstoreWebapp')
    .factory('BookFactory', function($resource, API_URL) {
    return $resource(API_URL+'/book/:bookId', { bookId:'@_id' });
});
