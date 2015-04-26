module.exports = "tasker.layouts.logout";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  // require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("logout", {
    url: "/logout",
    template: "",
    controller: "LogoutController as vm",
  });
  
}]);

module.controller("LogoutController", ["$state", "auth", "store", function ($state, auth, store) {
  var vm = this;
  
  vm.logout = function () {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    
    $state.go("login");
  };
  
  vm.logout();
  
}]);



