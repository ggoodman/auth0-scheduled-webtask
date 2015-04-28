module.exports = "tasker.states.dashboard.tasks";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  
  require("widgets/aceEditor"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("dashboard.tasks", {
    url: "/tasks",
    controller: "DashboardTasksController as tasks",
    template: require("./tasks.html"),
  });
  
  $stateProvider.state("dashboard.tasks.list", {
    url: "/",
    controller: "DashboardTasksController as tasks",
    template: require("./list.html"),
  });
  
  $stateProvider.state("dashboard.tasks.create", {
    url: "/create",
    controller: "DashboardTasksController as tasks",
    template: require("./create.html"),
  });
  
}]);

module.controller("DashboardTasksController", ["$state", "$stateParams", "auth", "store", function ($state, $stateParams, auth, store) {
  var tasks = this;
  
  if ($state.is("dashboard.tasks")) {
    $state.go("dashboard.tasks.list");
  }
  
  tasks.draft = {
    secrets: "{\n  \n}",
    code: "return function (cb) {\n    cb(null, 'done');\n}"
  };
  
}]);
