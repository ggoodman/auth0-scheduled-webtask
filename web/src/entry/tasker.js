module.exports = "tasker";


require("common/bootstrap.less");
require("common/layout.less");


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("angular-ui-router"),
  require("angular-animate"),
  require("angular-aria"),
  require("angular-bootstrap"),

  // require("ui-router-extras"),
  
  'auth0', 'angular-storage', 'angular-jwt', // Auth0
  
  require("layouts/layout/layout"),
  require("layouts/login/login"),
  require("layouts/logout/logout"),
  
  require("states/dashboard/dashboard"),
]);


module.config(["$locationProvider", "$urlRouterProvider", function ($locationProvider, $urlRouterProvider) {
  
  $locationProvider.html5Mode(true).hashPrefix('!');
  
  $urlRouterProvider.otherwise('/dashboard/');
}]);

module.config(["authProvider", function (authProvider) {
  authProvider.init({
    domain: 'filearts.auth0.com',
    clientID: 'BSi25g1G1V8ssGW2KG2vl0wJb67vRaBp',
  });
}]);


module.run(["$rootScope", "$state", "auth", "jwtHelper", "store", function ($rootScope, $state, auth, jwtHelper, store) {
  
  auth.returnTo = null;

  // auth.hookEvents();
  
  // Expose global state accessors to templates
  $rootScope.$auth = auth;
  $rootScope.$state = $state;
  
  $rootScope.$on("auth0.loginSuccess", function () {
    if (auth.returnTo) {
      //TODO FIX
      $state.go(auth.returnTo.state, auth.returnTo.params);
      
      auth.returnTo = null;
    } else {
      $state.go("dashboard.home");
    }
  });
  
  $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
    var token = store.get('token');
    var requireLogin = function (params) {
      store.remove('profile');
      store.remove('token');
              
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
        console.log("auth0", "token", token);
        
        if (!jwtHelper.isTokenExpired(token)) {
          e.preventDefault();
          
          auth.authenticate(store.get('profile'), token, "dashboard")
            .then(function (resp) {
              console.log("auth0", "auth", resp);
              
              // Auth0 was able to refresh the token; go to where the user was
              // originally going
              $state.go(toState, toParams);
            })
            .catch(function (err) {
              console.error("auth0", "error", err);
              
              // Error refreshing the token with Auth0, redirect to login page
              // with an error message
              requireLogin({err: err.message || err});
            });
        } else {
          e.preventDefault();
          
          requireLogin();
        }
      } else if (!toState.noAuth) {
        e.preventDefault();
        
        requireLogin();
      }
    }
  });
  
  
  
}]);

