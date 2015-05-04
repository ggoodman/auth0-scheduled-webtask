module.exports = "tasker.states.dashboard.tasks";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  
  require("directives/jsonModel"),
  
  require("services/api"),
  
  require("widgets/aceEditor"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  var resolveDraftTask = [ function () {
    return {
      name: "",
      secrets: {},
      code: "return function (cb) {\n    cb(null, 'done');\n}",
      schedule: "",
    };
  }];
  
  var resolveTask = ["$stateParams", "api", function ($stateParams, api) {
    return api.get("/tasks/" + $stateParams.id);
  }];
  
  var resolveTasks = ["api", function (api) {
    return api.get("/tasks");
  }];
  
  $stateProvider.state("dashboard.tasks", {
    'abstract': true,
    url: "/tasks",
    // controller: "DashboardTasksController as tasks",
    template: require("./tasks.html"),
  });
  
  $stateProvider.state("dashboard.tasks.list", {
    url: "/?msg&err",
    resolve: {
      tasks: resolveTasks,
    },
    controller: "TasksListController as vm",
    template: require("./list.html"),
  });
  
  $stateProvider.state("dashboard.tasks.create", {
    url: "/create?msg&err",
    resolve: {
      task: resolveDraftTask,
    },
    controller: "TasksEditController as vm",
    template: require("./edit.html"),
  });
  
  $stateProvider.state("dashboard.tasks.show", {
    url: "/:id?msg&err",
    resolve: {
      task: resolveTask,
    },
    controller: "TasksShowController as vm",
    template: require("./show.html"),
  });
  
}]);

module.controller("TasksListController", ["$state", "$stateParams", "api", "tasks", function ($state, $stateParams, api, tasks) {
  var vm = this;
  
  vm.tasks = tasks;
  
}]);

module.controller("TasksEditController", ["$state", "$stateParams", "api", "task", function ($state, $stateParams, api, task) {
  var vm = this;
  
  vm.draft = Angular.copy(task);
  
  vm.create = function (taskDef) {
    return api.post("/tasks", {}, taskDef)
      .then(function (newTask) {
        console.log("Resp", newTask);
        $state.go("dashboard.tasks.show", {
          id: newTask._id,
          msg: "Webtask created and scheduled for execution",
        });
      })
      .catch(function (err) {
        console.error("Task creation failed", err);
        vm.err = err.message || err;
      });
  };
  
}]);


module.controller("TasksShowController", ["$state", "api", "task", function ($state, api, task) {
  var vm = this;
  
  vm.task = task;
  
  vm.destroyTask = function (task) {
    api.delete("/tasks/" + task._id)
      .then(function () {
        $state.go("dashboard.tasks.list");
      })
      .catch(function (err) {
        vm.err = err.message || err;
      });
  };
}]);