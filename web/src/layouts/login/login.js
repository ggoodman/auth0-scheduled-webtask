module.exports = "tasker.layouts.login";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
]);


module.config(["$stateProvider", function ($stateProvider) {
  
  $stateProvider.state("login", {
    url: "/login?err",
    template: require("layouts/login/login.html"),
    controller: "LoginController as vm",
    noAuth: true,
  });
  
}]);

module.controller("LoginController", ["$state", "$stateParams", "auth", "store", function ($state, $stateParams, auth, store) {
  var vm = this;
  
  if (auth.isAuthenticated) {
    $state.go("dashboard");
  }
  
  vm.login = function () {
    var resp = auth.signin({
      connections: ['github'],
    }, function(profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
    }, function (err) {
      
      
      console.error(err);
      // Error callback
    });
  };
  
  vm.login();
  
}]);



