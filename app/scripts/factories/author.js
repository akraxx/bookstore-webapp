'use strict';

angular.module('bookstoreWebapp')
  .factory('AuthorFactory', function ($resource, API_URL) {
    return $resource(API_URL + '/author/:authorId', {authorId: '@_id'});
  });
