module.exports = "tasker.states.dashboard";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
  
  require("./home/home"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("dashboard", {
    dsr: true,
    url: "/dashboard",
    controller: "DashboardController as dashboard",
    template: require("./dashboard.html"),
    parent: "layout",
  });
  
}]);

module.controller("DashboardController", ["$state", "$stateParams", "auth", "store", function ($state, $stateParams, auth, store) {
  var dashboard = this;
  
  if ($state.is("dashboard")) {
    console.log("Going to dashboard.home")
    $state.go("dashboard.home");
  }
  
}]);



