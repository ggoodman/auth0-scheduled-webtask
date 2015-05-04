module.exports = "tasker.widgets.aceEditor";


require("./aceEditor/aceEditor.less");

var Resizer = require("exports?addResizeListener&removeResizeListener!../vendor/addResizeListener");

var Ace = require("ace-builds/src-noconflict/ace");
var Angular = require("angular");


var module = Angular.module(module.exports, [
]);


Ace.config.set("basePath", "/ace/");



module.directive("aceEditor", [function () {
  var Range = Ace.require("ace/range").Range;
  
  return {
    restrict: "A",
    require: "ngModel",
    link: function ($scope, $element, $attrs, model) {
      var editorEl = Angular.element("<div></div>");
      
      $attrs.$addClass("ace-editor");
      
      $element.append(editorEl);
      
      var editor = Ace.edit(editorEl[0]);
      
      Resizer.addResizeListener(editorEl[0], editor.resize.bind(editor));
      
      editor.setHighlightActiveLine(false);
      editor.session.setTabSize(2);
      editor.session.setUseSoftTabs(true);
      editor.session.setValue(model.$viewValue);
      editor.renderer.setShowGutter(!!$attrs.showGutter);
      editor.renderer.setShowPrintMargin(!!$attrs.showPrintMargin);
      editor.setOptions({
        minLines: parseInt($attrs.minLines, 10) || 2,
        maxLines: parseInt($attrs.maxLines, 10) || 12
      });
      
      $attrs.$observe("mode", function (mode) {
        editor.session.setMode("ace/mode/" + (mode || "text"));
      })
      
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
      
      model.$render = function () {
        var doc = editor.session.doc;
        var val = doc.getValue();
        var value = model.$viewValue || "";
        
        doc.replace(Range.fromPoints(doc.indexToPosition(0), doc.indexToPosition(val.length)), value || "");
      };
      
      editor.on("change", function () {
        var contents = editor.session.getValue();

        model.$setViewValue(contents, "change");
        
        if (!$scope.$root.$$phase) $scope.$digest();
      });
      
      editor.on("focus", function () {
        $attrs.$addClass("focus");
        
        if (!$scope.$root.$$phase) $scope.$digest();
      });
      
      editor.on("blur", function () {
        $attrs.$removeClass("focus");
        
        if (!$scope.$root.$$phase) $scope.$digest();
      });
      
      $scope.$on("fa-pane-resize", function () {
        editor.resize();
      });
      
      $scope.$on("$destroy", function () {
        Resizer.removeResizeListener(editorEl[0], editor.resize.bind(editor));
      });
    }
  };
}]);
