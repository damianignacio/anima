(function () {
    'use strict';

    var module = angular.module('anima.widgets', []);

    /**
     * Widget: Select image
     */
    module.directive('animaSelectImage', function (fileBrowserDialog, settings) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                options: '=',
            },
            templateUrl: settings.STATIC_URL + 'anima/tpls/widgets/select-image.html',
            link: function (scope, element, attrs) {
                scope.images = function () {
                    return angular.toJson(scope.options.value);
                };
                scope.selectedImages = function () {
                    return scope.options.value;
                };
                scope.unselectImage = function (image) {
                    var index = scope.options.value.indexOf(image);
                    if (index != -1) {
                        scope.options.value.splice(index, 1);
                    }
                };
                scope.addImage = function (name, url, type) {
                    scope.options.value.push({
                        'name': name,
                        'url': url,
                        'type': type
                    });
                };

                scope.selectImage = function () {
                    fileBrowserDialog.open({
                        callback: scope.addImage,
                        path: scope.options.path
                    });
                };
            }
        };
    });

})();




