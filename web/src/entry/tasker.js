module.exports = "tasker";


require("angular-material/angular-material.css");


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  require("angular-animate"),
  require("angular-aria"),
  require("angular-material"),

  // require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
  
  require("layouts/layout/layout"),
  require("layouts/login/login"),
  require("layouts/logout/logout"),
]);


module.config(["$locationProvider", "$urlRouterProvider", function ($locationProvider, $urlRouterProvider) {
  
  $locationProvider.html5Mode(true).hashPrefix('!');
  
  $urlRouterProvider.otherwise('/');
}]);

module.config(["authProvider", function (authProvider) {
  authProvider.init({
    domain: 'filearts.auth0.com',
    clientID: 'BSi25g1G1V8ssGW2KG2vl0wJb67vRaBp',
  });
}]);


module.run(["$rootScope", "$state", "auth", "jwtHelper", "store", function ($rootScope, $state, auth, jwtHelper, store) {
  
  auth.returnTo = null;

  auth.hookEvents();
  
  $rootScope.$on("auth0.loginSuccess", function () {
    if (auth.returnTo) {
      //TODO FIX
      $state.go(auth.returnTo.state, auth.returnTo.params);
      
      auth.returnTo = null;
    }
  });
  
  $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
    var token = store.get('token');
    var requireLogin = function (params) {
      auth.returnTo = {
        state: toState,
        params: toParams,
      };
    
      $state.go('login', params);
    };
    
    // The user is not authenticated
    if (!auth.isAuthenticated) {
      
      // However, they DO have a token, lets see if it is expired and in need
      // of a refresh
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          e.preventDefault();
          
          auth.authenticate(store.get('profile'), token, "layout")
            .then(function (resp) {
              
              // Auth0 was able to refresh the token; go to where the user was
              // originally going
              $state.go(toState, toParams);
            })
            .catch(function (err) {
              // Error refreshing the token with Auth0, redirect to login page
              // with an error message
              requireLogin({err: err.message || err});
            });
        } else {
          requireLogin();
        }
      } else if (!toState.noAuth) {
        e.preventDefault();
        
        requireLogin();
      }
    }
  });
  
  
  
}]);

