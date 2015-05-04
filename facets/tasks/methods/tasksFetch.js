var Boom = require("boom");
var Promise = require("bluebird");

var Mongo = require("../../../adapters/mongodb");


module.exports = function (auth, taskId, next) {
  var query = {
    _id: taskId,
    user_id: auth.credentials._id,
  };
  
  Mongo.db.findOne("tasks", query)
    .then(function (task) {
      // TODO: Transform response?
      return task;
    })
    .nodeify(next);
};