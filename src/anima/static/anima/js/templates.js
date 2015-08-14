(function(module) {
try { module = angular.module("anima.templates"); }
catch(err) { module = angular.module("anima.templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("anima/tpls/directives/file-browser.html",
    "<div class=\"modal fade anm-file-browser\">\n" +
    "  <div class=\"modal-dialog modal-lg\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"close()\">\n" +
    "          <span aria-hidden=\"true\">&times;</span>\n" +
    "        </button>\n" +
    "        <h4 class=\"modal-title\">File browser</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "        <!-- TODO: Move this to a stylesheet -->\n" +
    "        <div class=\"anm-overlay\" style=\"\n" +
    "          display: none;\n" +
    "          position: absolute;\n" +
    "          height: 100%;\n" +
    "          width: 100%;\n" +
    "          z-index: 10;\n" +
    "          top: 0px;\n" +
    "          left: 0px;\n" +
    "        \">\n" +
    "          <div style=\"\n" +
    "            position: absolute;\n" +
    "            height: 100%;\n" +
    "            width: 100%;\n" +
    "            background: #000;\n" +
    "            z-index: 10;\n" +
    "            opacity: 0.07;\n" +
    "            border-radius: 4px;\n" +
    "          \">\n" +
    "\n" +
    "          </div>\n" +
    "          <i style=\"\n" +
    "            display: inline-block;\n" +
    "            font-size: 20px;\n" +
    "            margin-top: 30px;\n" +
    "            margin-top: 10px;\n" +
    "            float: right;\n" +
    "            margin-right: 10px;\n" +
    "          \" class=\"fa  fa-circle-o-notch fa-spin\"></i>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-sm-12\">\n" +
    "            <div class=\"alert alert-danger alert-dismissable\" ng-repeat=\"error in errors\">\n" +
    "              <button type=\"button\" class=\"close\" ng-click=\"resetErrors()\">&#215;</button>\n" +
    "              {{ error }}\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <h4>Upload</h4>\n" +
    "            <form method=\"post\" enctype=\"multipart/form-data\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                  <span class=\"btn btn-primary anm-file\">\n" +
    "                      Browse <input type=\"file\" anima-file-model=\"fileInput\">\n" +
    "                  </span>\n" +
    "                </span>\n" +
    "                <input type=\"text\" class=\"form-control\" readonly value=\"{{ fileInput.name }}\">\n" +
    "                <span ng-if=\"fileInput\" class=\"input-group-btn\">\n" +
    "                  <a ng-click=\"upload()\" class=\"btn btn-primary\" type=\"submit\" >Upload</a>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </form>\n" +
    "            <h4>Files</h4>\n" +
    "            <div class=\"form-group anm-search\">\n" +
    "              <span class=\"fa fa-search\"></span>\n" +
    "              <input class=\"form-control\" type=\"search\" ng-model=\"q\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-group input-group-sm\">\n" +
    "                <span class=\"input-group-addon\">Path</span>\n" +
    "                <span class=\"form-control\">\n" +
    "                  {{ path }}<input ng-model=\"createFolderName\" style=\"border: none;\" type=\"text\">\n" +
    "                </span>\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                  <a ng-click=\"createFolder()\" class=\"btn btn-primary btn-sm\" type=\"submit\" >Create folder</a>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-4\">\n" +
    "            <div class=\"form-group\" ng-if=\"imagePreview\">\n" +
    "              <h4>Preview</h4>\n" +
    "              <div class=\"text-center\">\n" +
    "                <a target=\"_blank\" href=\"{{ imagePreview.url }}\">\n" +
    "                  <img class=\"img-thumbnail\" style=\"max-width: 100%; height: auto; margin: 0 auto;\" ng-src=\"{{ imagePreview.url }}\">\n" +
    "                </a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"clearfix\">\n" +
    "          <div class=\"table-responsive\">\n" +
    "            <table class=\"table table-hover\">\n" +
    "              <thead>\n" +
    "                <tr>\n" +
    "                  <th>File name</th>\n" +
    "                  <th></th>\n" +
    "                </tr>\n" +
    "              </thead>\n" +
    "              <tbody>\n" +
    "                <tr class=\"{{ file.type }}\" ng-repeat=\"file in files | filter:q as results\" ng-dblclick=\"select(file)\">\n" +
    "                  <td>\n" +
    "                    <div class=\"anm-truncate\">{{ file.name }}</div>\n" +
    "                  </td>\n" +
    "                  <td>\n" +
    "                    <a ng-if=\"file.type == 'image'\" class=\"btn btn-xs btn-default\" ng-click=\"preview(file)\">\n" +
    "                      <i class=\"fa fa-photo\"></i>&nbsp;Preview\n" +
    "                    </a>\n" +
    "                    <a ng-if=\"file.type != 'directory'\" class=\"btn btn-xs btn-danger\" ng-click=\"delete(file)\">\n" +
    "                      <i class=\"fa fa-trash\"></i>&nbsp;Delete\n" +
    "                    </a>\n" +
    "                  </td>\n" +
    "                </tr>\n" +
    "                <tr ng-if=\"isEmptyFolder()\" class=\"info\">\n" +
    "                  <td colspan=\"2\">Empty folder</td>\n" +
    "                </tr>\n" +
    "              </tbody>\n" +
    "            </table>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button ng-click=\"close()\" type=\"button\" class=\"btn btn-default\">Close</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("anima.templates"); }
catch(err) { module = angular.module("anima.templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("anima/tpls/widgets/select-image-multiple.html",
    "<div>\n" +
    "  <ul class=\"list-unstyled\" anima-sortable=\"{el: 'li', items: options.value, placeholder: 'anm-placeholder anm-form-item'}\">\n" +
    "    <li class=\"anm-form-item\" ng-repeat=\"file in options.value\">\n" +
    "      <div class=\"clearfix\">\n" +
    "        <a style=\"padding-right: 10px;\" class=\"pull-left\" ng-if=\"file.type == 'image'\" target=\"_blank\" href=\"{{ file.url }}\">\n" +
    "          <img class=\"img-thumbnail\" style=\"height: 60px; width: 60px;\" ng-src=\"{{ file.url }}\">\n" +
    "        </a>\n" +
    "        <label>{{ file.name }}</label>\n" +
    "        <a class=\"pull-right btn btn-danger btn-sm\" ng-click=\"unselectImage(file)\">\n" +
    "          <i class=\"fa fa-trash\"></i></i>&nbsp;Remove\n" +
    "        </a>\n" +
    "      </div>\n" +
    "      <small><em><a target=\"_blank\" href=\"{{ file.url }}\">{{ file.url }}</a></em></small>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <textarea style=\"display: none;\" name=\"{{ options.name }}\">{{ images() }}</textarea>\n" +
    "  <a class=\"anm-select-image btn btn-success\" ng-click=\"selectImage()\">Select image</a>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("anima.templates"); }
catch(err) { module = angular.module("anima.templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("anima/tpls/widgets/select-image.html",
    "<div>\n" +
    "  <div class=\"input-group\">\n" +
    "    <span class=\"input-group-btn\">\n" +
    "      <a class=\"anm-select-image btn btn-success\" ng-click=\"selectImage()\">Select file</a>\n" +
    "    </span>\n" +
    "    <input type=\"text\" class=\"form-control\" readonly value=\"{{ options.value.url }}\">\n" +
    "    <span ng-if=\"options.value\" class=\"input-group-btn\">\n" +
    "      <a class=\"pull-right btn btn-danger\" ng-click=\"unselectImage()\">\n" +
    "        <i class=\"fa fa-trash\"></i></i>&nbsp;Remove\n" +
    "      </a>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <textarea style=\"display: none;\" name=\"{{ options.name }}\">{{ images() }}</textarea>\n" +
    "</div>\n" +
    "");
}]);
})();
