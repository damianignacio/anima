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
            templateUrl: function (el, attrs) {
                var suffix = (typeof attrs.multiple != 'undefined') ? '-multiple' : '';
                console.log(suffix);
                return settings.STATIC_URL + 'anima/tpls/widgets/select-image' + suffix + '.html';
            },
            link: function (scope, element, attrs) {

                scope.multiple = (typeof attrs.multiple != 'undefined') ? '-multiple' : '';


                scope.images = function () {
                    return angular.toJson(scope.options.value);
                };

                scope.selectedImages = function () {
                    return scope.options.value;
                };

                scope.unselectImage = function (image) {
                    if (scope.multiple) {
                        var index = scope.options.value.indexOf(image);
                        if (index != -1) {
                            scope.options.value.splice(index, 1);
                        }
                    } else {
                        scope.options.value = null;
                    }
                };
                scope.addImage = function (file) {
                    var image = {
                        'name': file.name,
                        'url': file.url,
                        'type': file.type,
                        'eTag': file.eTag
                    };

                    if (scope.multiple) {
                        scope.options.value.push(image);
                    } else {
                        scope.options.value = image;
                    }
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




