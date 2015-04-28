module.exports = "tasker.services.ace";



var Ace = require("ace");
var Angular = require("angular");

Ace.config.set("basePath", "/static/ace/");

var module = Angular.module(module.exports, [
]);


module.factory("ace", ["$q", "$timeout", function ($q, $timeout) {
  var moduleCache = {};
  
  
  Ace.with = function (moduleName) {
    if (!moduleCache[moduleName]) {
      var dfd = $q.defer();
      
      moduleCache[moduleName] = dfd.promise
        .then(function (module) {
          if (!module) throw new Error("Module load timed out");
          
          return module;
        });
      
      Ace.config.loadModule(moduleName, dfd.resolve);
    }
    
    return moduleCache[moduleName];
  };
  
  return Ace;
}]);
