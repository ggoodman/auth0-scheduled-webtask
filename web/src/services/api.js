module.exports = "tasker.services.api";


var Angular = require("angular");


var module = Angular.module(module.exports, [
  require("services/config"),
]);

module.factory("api", ["$http", "auth", "config", function ($http, auth, config) {
  var timePromise = function (key, promise) {
    // noop for now
    return promise;
  };
  
  var handleError = function (resp) {
    throw resp.data;
  };
  
  var api = {
    'delete': function (path, query) {
      if (!query) query = {};
      
      path = (path || "/");
      
      return timePromise(path, $http.delete(config.apiUrl + path, {
        headers: { 'Authorization': "Bearer " + auth.idToken },
        params: query,
      }))
        .catch(handleError);
    },
    'get': function (path, query, options) {
      if (!query) query = {};
      if (!options) options = {};
      
      var handleResponse = function (resp) {
        var data = resp.data;
        
        if (data.results && data.meta) {
          data = resp.data.results;
          data.meta = resp.data.meta;
        }
        
        return data;
      };
      
      options = Angular.extend(options, {
        headers: {
          'Authorization': "Bearer " + auth.idToken,
          'Accept': "application/json; charset=UTF-8",
        },
        params: query,
      });
      
      path = (path || "/");
      
      return timePromise(path, $http.get(config.apiUrl + path, options))
        .then(handleResponse)
        .catch(handleError);
    },
    'post': function (path, query, payload, options) {
      if (!query) query = {};
      if (!options) options = {};
      
      options = Angular.extend(options, {
        headers: {
          'Authorization': "Bearer " + auth.idToken,
          'Accept': "application/json; charset=UTF-8",
          'Content-Type': "application/json; charset=UTF-8"
        },
        params: query,
      });
      
      path = (path || "/");
      
      var handleResponse = function (resp) {
        var data = resp.data;
        
        if (data.results && data.meta) {
          data = resp.data.results;
          data.meta = resp.data.meta;
        }
        
        return data;
      };
      
      return timePromise(path, $http.post(config.apiUrl + path, payload, options))
        .then(handleResponse)
        .catch(handleError);
    },
  };
  
  return api;
}])