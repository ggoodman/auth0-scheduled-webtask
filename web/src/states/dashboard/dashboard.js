module.exports = "tasker.states.dashboard";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
  
  require("./home/home"),
  require("./tasks/tasks"),
  require("./settings/settings"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("dashboard", {
    abstract: true,
    dsr: true,
    url: "/dashboard",
    controller: "DashboardController as dashboard",
    template: require("./dashboard.html"),
    parent: "layout",
  });
  
}]);

module.controller("DashboardController", ["$rootScope", "$state", "auth", function ($rootScope, $state, auth) {
  var vm = this;
  
  if ($state.is("dashboard")) {
    $state.go("dashboard.home");
  }
  
  // Users need to configure their token first. So as long as the user is in
  // the dashboard and does not have a token defined, redirect to
  // 'dashboard.settings'
  
  // $rootScope.$on("$stateChangeStart", function (e, toState) {
  //   if (toState.name !== "dashboard.settings" && toState.name.split(".")[0] === "dashboard") {
  //     e.preventDefault();
      
  //     $state.go("dashboard.settings", {msg: "You need to configure a token to work with Tasker."});
  //   }
  // });
  
  
}]);



