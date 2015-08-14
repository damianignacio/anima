(function () {

    'use strict';

    var module = angular.module('anima.directives', []);

    module.directive('animaFileModel', function () {
        return {
            scope: {
                file: "=animaFileModel"
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (event) {
                    scope.$apply(function () {
                        scope.file = event.target.files[0];

                        // or all selected files:
                        // scope.fileread = changeEvent.target.files;
                    });
                    scope.$watch('file', function (newValue, oldValue) {
                        if (newValue === null) {
                            element.val(null);
                        }
                    });
                });
            }
        };
    });

    module.directive('animaSortable', function () {
        return {
            restrict: 'A',
            scope: {
                options: '=animaSortable',
            },
            link: function (scope, element, attrs) {

                element.on('sortstart', function(e, ui) {
                    ui.item.data('start', ui.item.index());
                });

                element.on('sortstop', function(e, ui) {
                    e.stopPropagation();

                    var start = ui.item.data('start'),
                        end = ui.item.index();

                    scope.options.items.splice(
                        end, 0, scope.options.items.splice(start, 1)[0]
                    );
                    scope.$apply();
                });

                // Disable selection on the container
                element.on('selectstart', function (event) {
                    event.preventDefault();
                });

                // Initialize sortable
                element.sortable({
                    dropOnEmpty: false,
                    items: scope.options.el,
                    placeholder: scope.options.placeholder,
                    forcePlaceholderSize: true,
                    cursor: 'move',
                    helper: function(event, el) {
                        return el.clone().appendTo('body');
                    }
                });
            }
        };
    });

})();




