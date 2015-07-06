describe('Select image widget', function() {

    var $compile,
        $rootScope;

    var fileBrowserDialog = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(function () {
        module('anima');
        module('anima.templates');
        module(function ($provide) {
            $provide.constant('settings', {
                STATIC_URL: ''
            });
            $provide.factory('fileBrowserDialog', function () {
                return fileBrowserDialog;
            });
        });
    });

    beforeEach(inject(function (_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    var compileElement = function (options) {
        var scope = $rootScope.$new();
        scope.options = options;
        var element = $compile('<anima-select-image options="options"></anima-select-image>')(scope);
        $rootScope.$digest();
        return element;
    };

    it('creates a textarea', function () {
        var element = compileElement({name: 'input-name', value: null});
        expect(element.find('textarea').length).toBe(1);
    });

    it('gets textarea name from the options', function () {
        var element = compileElement({name: 'input-name', value: null});
        expect(element.find('textarea').attr('name')).toBe('input-name');
    });

    it('ensure the textarea is not visible', function () {
        var element = compileElement({name: 'input-name', value: null});
        expect(element.find('textarea').is(':visible')).toBe(false);
    });

    it('has a default initial value', function () {
        var element = compileElement({path: null, name: 'input-name', value: null});
        expect(element.find('textarea').val()).toBe('null');
    });

    it('can has a initial value', function () {
        var element = compileElement({
            path: null,
            name: 'input-name',
            value: {
                url: '...'
            }
        });
        expect(element.find('textarea').val()).toBe('{"url":"..."}');
    });

    it('updates the textarea when adding images', function () {
        var element = compileElement({path: null, name: 'input-name', value: null});
        var scope = element.isolateScope();

        scope.addImage({
            name: 'Image #1',
            url: 'http://xyz1',
            type: 'image',
            eTag: 'xyz1',
        });
        scope.addImage({
            name: 'Image #2',
            url: 'http://xyz2',
            type: 'image',
            eTag: 'xyz2',
        });
        $rootScope.$digest();
        result = angular.toJson({name: 'Image #2', url: 'http://xyz2', type: 'image', eTag: 'xyz2'});

        expect(element.find('textarea').val()).toBe(result);
    });

    it('it triggers file browser dialog when click on select image', function () {
        var element = compileElement({path: 'media/', name: 'input-name', value: null});
        var scope = element.isolateScope();
        expect(element.find('.anm-select-image').length).toBe(1);

        element.find('.anm-select-image').trigger('click');
        expect(fileBrowserDialog.open).toHaveBeenCalledWith({
            callback: scope.addImage,
            path: 'media/',
        });
    });
});