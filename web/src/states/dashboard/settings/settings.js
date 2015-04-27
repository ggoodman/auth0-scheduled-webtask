module.exports = "tasker.states.dashboard.settings";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("dashboard.settings", {
    url: "/settings?err&msg",
    controller: "DashboardSettingsController as settings",
    template: require("./settings.html"),
  });
  
}]);

module.controller("DashboardSettingsController", ["$state", "$stateParams", "auth", "store", function ($state, $stateParams, auth, store) {
  var settings = this;
  
  settings.msg = $stateParams.msg;
  
  settings.updateToken
  
}]);



