module.exports = "tasker.layouts.layout";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("layout", {
    url: "/",
    template: require("layouts/layout/layout.html"),
    data: {
      requiresLogin: true,
    }
  });
  
}]);


