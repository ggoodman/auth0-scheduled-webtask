module.exports = "tasker.states.dashboard.home";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  var resolveTasks = ["api", function (api) {
    return api.get("/tasks");
  }];
  
  $stateProvider.state("dashboard.home", {
    url: "/",
    resolve: {
      tasks: resolveTasks,
    },
    controller: "DashboardHomeController as dashboard",
    template: require("./home.html"),
  });
  
}]);

module.controller("DashboardHomeController", ["$state", "$stateParams", "auth", "tasks", function ($state, $stateParams, auth, tasks) {
  var vm = this;
  
  vm.tasks = tasks;
}]);



