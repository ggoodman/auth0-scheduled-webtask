module.exports = "tasker.states.dashboard.home";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("dashboard.home", {
    url: "/",
    controller: "DashboardHomeController as dashboard",
    template: require("./home.html"),
  });
  
}]);

module.controller("DashboardHomeController", ["$state", "$stateParams", "auth", "store", function ($state, $stateParams, auth, store) {
  var home = this;
  
  
}]);



