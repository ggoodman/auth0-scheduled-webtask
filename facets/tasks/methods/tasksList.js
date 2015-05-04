var Boom = require("boom");
var Promise = require("bluebird");

var Mongo = require("../../../adapters/mongodb");


module.exports = function (auth, next) {
  var query = {
    user_id: auth.credentials._id,
  };
  
  Mongo.db.find("tasks", query)
    .then(function (tasks) {
      // TODO: Transform response?
      return tasks;
    })
    .nodeify(next);
};