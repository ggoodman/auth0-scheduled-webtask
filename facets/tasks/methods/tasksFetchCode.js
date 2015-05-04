var Boom = require("boom");
var Promise = require("bluebird");

var Mongo = require("../../../adapters/mongodb");


module.exports = function (taskId, next) {
  var query = {
    _id: taskId,
  };
  
  Mongo.db.findOne("tasks", query)
    .then(function (task) {
      // TODO: Transform response?
      return task.code;
    })
    .nodeify(next);
};