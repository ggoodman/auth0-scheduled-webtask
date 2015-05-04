module.exports = "tasker.directives.jsonModel";


var Angular = require("angular");


var module = Angular.module(module.exports, [
]);




module.directive("jsonModel", [function () {
  return {
    restrict: "A",
    priority: 100, // Copy ngList
    require: "ngModel",
    link: function ($scope, $element, $attrs, model) {
      
      model.$parsers.push(function (value) {
        try {
          return JSON.parse(value);
        } catch (err) {
          return;
        }
      });
      
      model.$formatters.push(function (value) {
        try {
          return JSON.stringify(value);
        } catch (err) {
          return;
        }
      });
      
      // model.$validators.json = function (modelValue, viewValue) {
      //   var value = modelValue || viewValue;
      //   var error = null;
        
      //   // Rely on 'required' validator to handle empty strings
      //   if (!value) return true;
        
      //   try {
      //     JSON.parse(value);
      //   } catch (err) {
      //     error = err;
      //   }
        
      //   return !error;
      // };
    }
  };
}]);
