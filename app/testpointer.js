(function (angular) {
    'use strict';

    angular.module('TestApp', ['ngGesture'])
        .controller('TestCtrl', ['$scope', function(scope) {
            scope.alert = function (message) {
                alert(message);
            };
        }]);

}(this.angular));
