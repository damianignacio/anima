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

                element.find('input').on('focus', function () {
                    scope.selectImage();
                });

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

                scope.selectImage = function () {
                    fileBrowserDialog.open({
                        callback: function (name, url, type) {
                            scope.options.value.push({
                                'name': name,
                                'url': url,
                                'type': type
                            });
                        },
                        path: scope.options.path
                    });
                };
            }
        };
    });

})();




