describe('Select image widget (multiple)', function() {

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
        var element = $compile('<anima-select-image multiple options="options"></anima-select-image>')(scope);
        $rootScope.$digest();
        return element;
    };

    it('creates a textarea', function () {
        var element = compileElement({name: 'input-name', value: []});
        expect(element.find('textarea').length).toBe(1);
    });

    it('gets textarea name from the options', function () {
        var element = compileElement({name: 'input-name', value: []});
        expect(element.find('textarea').attr('name')).toBe('input-name');
    });

    it('ensure the textarea is not visible', function () {
        var element = compileElement({name: 'input-name', value: []});
        expect(element.find('textarea').is(':visible')).toBe(false);
    });

    it('has a default initial value', function () {
        var element = compileElement({path: null, name: 'input-name', value: []});
        expect(element.find('.anm-form-item').length).toBe(0);
        expect(element.find('textarea').val()).toBe('[]');
    });

    it('can has a initial value', function () {
        var element = compileElement({
            path: null,
            name: 'input-name',
            value: [{
                url: '...'
            }, {
                url: '...'
            }]
        });
        expect(element.find('textarea').val()).toBe('[{"url":"..."},{"url":"..."}]');
        expect(element.find('.anm-form-item').length).toBe(2);
    });

    it('updates the textarea when adding images', function () {
        var element = compileElement({path: null, name: 'input-name', value: []});
        var scope = element.isolateScope();
        expect(element.find('.anm-form-item').length).toBe(0);

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
        expect(element.find('.anm-form-item').length).toBe(2);

        result = angular.toJson([
            {name: 'Image #1', url: 'http://xyz1', type: 'image', eTag: 'xyz1'},
            {name: 'Image #2', url: 'http://xyz2', type: 'image', eTag: 'xyz2'}
        ]);

        expect(element.find('textarea').val()).toBe(result);
    });

    it('it triggers file browser dialog when click on select image', function () {
        var element = compileElement({path: 'media/', name: 'input-name', value: []});
        var scope = element.isolateScope();
        expect(element.find('.anm-select-image').length).toBe(1);

        element.find('.anm-select-image').trigger('click');
        expect(fileBrowserDialog.open).toHaveBeenCalledWith({
            callback: scope.addImage,
            path: 'media/',
        });
    });
});