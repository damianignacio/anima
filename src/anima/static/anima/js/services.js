(function () {

    'use strict';

    var module = angular.module('anima.services', []);

    var $ = angular.element;

    /**
     * Service: Files service
     */
    module.factory('formDataTransform', function ($timeout, $q, settings, $http, $document) {
        return function (obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };
    });

    module.config(function ($httpProvider, $provide) {
        $provide.factory('httpInterceptor', function ($q, $rootScope) {
            return {
                request: function (config) {
                    // intercept and change config: e.g. change the URL
                    // config.url += '?nocache=' + (new Date()).getTime();
                    // broadcasting 'httpRequest' event
                    $rootScope.$broadcast('httpRequest', config);
                    return config || $q.when(config);
                },
                response: function (response) {
                    // we can intercept and change response here...
                    // broadcasting 'httpResponse' event
                    $rootScope.$broadcast('httpResponse', response);
                    return response || $q.when(response);
                },
                requestError: function (rejection) {
                    // broadcasting 'httpRequestError' event
                    $rootScope.$broadcast('httpRequestError', rejection);
                    return $q.reject(rejection);
                },
                responseError: function (rejection) {
                    // broadcasting 'httpResponseError' event
                    $rootScope.$broadcast('httpResponseError', rejection);
                    return $q.reject(rejection);
                }
            };
        });
        $httpProvider.interceptors.push('httpInterceptor');
    });



    /**
     * Service: Files service
     */
    module.factory('fileStorage', function ($timeout, $q, settings, $http, $document, formDataTransform) {

        // Incoming paths
        var sanitizePath = function (path) {
            if (!path) {
                return '';
            }
            return path.replace(/^\//, '').replace(/\/$/, '') + '/';
        };

        // Outcoming paths
        var preparePath = function (path) {
            if (!path) {
                return null;
            }
            return path.substring(bucketPath.length) || null;
        };

        var bucket = settings.FILE_BROWSER.bucket,
            bucketPath = sanitizePath(settings.FILE_BROWSER.bucketPath),
            bucketUrl = settings.FILE_BROWSER.bucketUrl,
            deleteUrl = settings.FILE_BROWSER.deleteUrl,
            signUploadUrl = settings.FILE_BROWSER.signUploadUrl,
            currentPath = null;

        var signUpload = function (file, path) {

            var csrfmiddlewaretoken = $document.find('input[name="csrfmiddlewaretoken"]').val();

            return $http({
                method: 'POST',
                url: signUploadUrl,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: formDataTransform,
                data: {
                    key: preparePath(path + file.name),
                    content_type: file.type,
                    csrfmiddlewaretoken: csrfmiddlewaretoken
                }
            });
        };

        var s3 = {
            query: function (path, marker) {

                var url = bucketUrl + '?delimiter=/',
                    prefix = '';

                if (path) {
                    prefix = path.replace(/^\//, '');
                }
                if (prefix) {
                    // make sure we end in /
                    prefix = prefix.replace(/\/$/, '') + '/'
                    url += '&prefix=' + prefix;
                }
                if (marker) {
                    url += '&marker=' + marker;
                }
                return url;
            },
            get: function (path, marker, items) {

                console.log(path);

                var marker = null,
                    items = [],
                    deferred = $q.defer();

                (function get (path, marker, items, deferred) {

                    var url = s3.query(path, marker);

                    $http.get(url).success(function (data, status, headers, config) {
                        var info = s3.parseResponse(data);

                        if (info.nextMarker !== null) {
                            get(path, info.nextMarker, items, deferred);
                        } else {

                            var all = info.directories.concat(info.files);

                            for (var i = all.length - 1; i >= 0; i--) {
                                items.push(all[i]);
                            }

                            // add the ../ at the start of the directory listing
                            // cannot go beyond the bucketPath
                            if (info.prefix && info.prefix != bucketPath) {

                                // one directory up
                                var key = info.prefix.replace(/\/$/, '').split('/').slice(0, -1).concat('').join('/');

                                items = [{
                                    up: true,
                                    name: '../',
                                    key: preparePath(key),
                                    type: 'directory',
                                }].concat(items);
                            }

                            console.log(items);
                            deferred.resolve({
                                path: preparePath(info.prefix),
                                files: items,
                            });
                        }
                    });

                })(path, marker, items, deferred);

                return deferred.promise;
            },
            parseResponse: function (data) {

                var xml = $($.parseXML(data)).children('ListBucketResult'),
                    prefix = xml.children('Prefix').text();

                var files = $.map(xml.find('Contents'), function (item) {
                    item = $(item);

                    var key = item.find('Key').text();

                    // Exclude the folders (looks like they are actual files but finish with "/")
                    if (/\/$/.test(key)) { return null; }

                    return {
                        name: key.substring(prefix.length),
                        key: preparePath(key),
                        lastModified: item.find('LastModified').text(),
                        size: item.find('Size').text(),
                        type: /\.(png|jpg|jpeg|gif)$/i.test(key) ? 'image' : 'file',
                        url: bucketUrl + key
                    }
                })

                files = files.filter(function (el) {
                    return el !== null;
                });

                var directories = $.map(xml.find('CommonPrefixes'), function (item) {
                    item = $(item);

                    var key = item.find('Prefix').text();

                    return {
                        name: key.substring(prefix.length),
                        key: preparePath(key),
                        type: 'directory',
                    }
                });

                if (xml.children('IsTruncated').text() == 'true') {
                    var nextMarker = xml.children('NextMarker').text();
                } else {
                    var nextMarker = null;
                }

                return {
                    files: files,
                    directories: directories,
                    prefix: prefix,
                    nextMarker: nextMarker
                }
            },
            upload: function (file, path) {

                var deferred = $q.defer()

                signUpload(file, path).success(function (s3, status, headers, config) {

                    var data = new FormData();
                    data.append('AWSAccessKeyId', s3.AWSAccessKeyId);
                    data.append('acl', s3.acl);
                    data.append('key', s3.key);
                    data.append('policy', s3.policy);
                    data.append('signature', s3.signature);
                    data.append('Content-Type', file.type);
                    data.append('file', file);

                    $http.post(s3.url, data, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function (data, status, headers, config) {
                        deferred.resolve(true);
                    });
                });

                return deferred.promise;
            },
            delete: function (key) {

                var deferred = $q.defer()

                $http({
                    method: 'POST',
                    url: deleteUrl,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: formDataTransform,
                    data: {
                        key: key,
                        csrfmiddlewaretoken: $document.find('input[name="csrfmiddlewaretoken"]').val()
                    }
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
        }

        return {
            get: function (path) {
                return s3.get(bucketPath + sanitizePath(path || ''));
            },
            upload: function (file, path) {
                return s3.upload(file, bucketPath + sanitizePath(path || ''));
            },
            delete: function (file) {
                return s3.delete(file);
            }
        }
    });

    /**
     * Service: File browser
     */
    module.factory('fileBrowserDialog', function ($document, $compile, $rootScope, $templateCache, $templateRequest, settings, fileStorage, $timeout) {

        var tpl,
            modal = null,
            scope = $rootScope.$new(),
            initialized = false,
            overlay = null;

        $templateRequest(settings.STATIC_URL + 'anima/tpls/directives/file-browser.html').then(function (response) {
            modal = angular.element(response);
        });

        scope.errors = []
        scope.errorsTimeout;
        scope.resetErrors = function () {
            $timeout.cancel(scope.errorsTimeout);
            scope.errors = [];
        };

        scope.imagePreview = null;
        scope.fileInput = null;
        scope.path = null;
        scope.createFolderName = null;

        scope.close = function () {
            modal.modal('hide');
        };

        scope.preview = function (file) {
            scope.imagePreview = null;
            $timeout(function () {
                scope.imagePreview = file;
            }, 10);
        };

        scope.delete = function (file) {
            scope.imagePreview = null;
            fileStorage.delete(file.key).then(function (data) {
                if (!data.errors) {
                    fileStorage.get(scope.path).then(function (response) {
                        scope.path = response.path;
                        scope.files = response.files;
                    });
                } else {
                    scope.resetErrors();
                    for (var i = data.errors.length - 1; i >= 0; i--) {
                        scope.errors.push(data.errors[i]);
                    };

                    // Auto hide errors
                    scope.errorsTimeout = $timeout(function () {
                        scope.errors = [];
                    }, 5000);
                }
            });
        };

        scope.select = function (file) {
            // Clear search
            scope.q = '';

            if (file.type == 'directory') {
                fileStorage.get(file.key).then(function (response) {
                    scope.path = response.path;
                    scope.files = response.files;
                });
            } else if (scope.callback) {
                scope.callback(file.name, file.url, file.type);
                scope.close();
            } else {
                scope.close();
            }
        };

        scope.isEmptyFolder = function () {
            if (!scope.files) { return true; }
            return (scope.files.length == 0 || (scope.files.length == 1 && scope.files[0].up))
        };

        scope.createFolder = function () {

            if (!scope.createFolderName || !scope.createFolderName.trim()) {
                return;
            }

            var createFolderPath;
            if (scope.path) {
                createFolderPath = scope.path + scope.createFolderName;
            } else {
                createFolderPath = scope.createFolderName;
            }
            fileStorage.get(createFolderPath).then(function (response) {
                scope.createFolderName = null;
                scope.path = response.path;
                scope.files = response.files;
            });
        };

        scope.upload = function () {
            fileStorage.upload(scope.fileInput, scope.path).then(function (success) {
                scope.fileInput = null;
                fileStorage.get(scope.path).then(function (response) {
                    scope.path = response.path;
                    scope.files = response.files;
                });
            });
        };

        function initialize (options) {
            if (initialized) { return false; };

            initialized = true;

            // Compile the scope
            $compile(modal)(scope);

            // Append the modal to the document and instatiate it
            $document.find('body').append(modal);
            overlay = modal.find('.anm-overlay');
            scope.isOpen = false;

            // Bind scope events
            scope.$on('httpRequest', function () {
                if (scope.isOpen) { overlay.show(); }
            });
            scope.$on('httpResponse', function () {
                overlay.hide();
            });
            scope.$on('httpResponseError', function () {
                overlay.hide();
            });

            // Bind modal events
            modal.modal({
                show: false
            }).on('selectstart', function (event) {
                event.preventDefault();
            }).on('show.bs.modal', function () {
                scope.isOpen = true;
            }).on('hide.bs.modal', function () {
                scope.isOpen = false;
            });

            return true;
        };

        return {
            open: function (options) {
                options = options || {};

                var justInitialized = initialize(options);

                // Clear search
                scope.q = '';

                modal.modal('show');

                if (justInitialized || scope.path != options.path) {
                    fileStorage.get(options.path).then(function (response) {
                        scope.path = response.path;
                        scope.files = response.files;
                    });
                }

                // Update scope
                scope.callback = options.callback;
            }
        };
    });

})();




