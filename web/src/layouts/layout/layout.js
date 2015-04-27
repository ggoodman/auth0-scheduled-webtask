module.exports = "tasker.layouts.layout";


require("layouts/layout/layout.less");



var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("layout", {
    abstract: true,
    template: require("layouts/layout/layout.html"),
  });
  
}]);


