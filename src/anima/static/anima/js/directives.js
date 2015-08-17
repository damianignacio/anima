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
                items: '=animaSortableItems',
            },
            link: function (scope, element, attrs) {

                var cachedModels = [], start, end;

                var getDOM = function () {
                    return element.find(scope.options.el)
                        .not(scope.options.placeholder);
                };

                var setModels = function (items) {
                    scope.items = items || [];
                    scope.$apply();
                };

                element.on('sortstart', function(e, ui) {
                    e.stopPropagation();
                    start = ui.item.index();

                    var dom = getDOM();

                    // Let angular update the DOM
                    cachedModels = scope.items;
                    setModels();

                    element.append(dom);
                    element.sortable('refresh');
                });

                element.on('sortstop', function(e, ui) {
                    e.stopPropagation();
                    end = ui.item.index();

                    getDOM().remove();

                    if (start != end) {
                        cachedModels.splice(
                            end, 0, cachedModels.splice(start, 1)[0]
                        );
                    }

                    // Let angular update the DOM
                    setModels(cachedModels);
                    element.sortable('refresh');
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




