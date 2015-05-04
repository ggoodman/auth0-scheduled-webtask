var Boom = require("boom");
var Cron = require("cron-parser");
var Promise = require("bluebird");

var Mongo = require("../../../adapters/mongodb");
var Webtasks = require("../../../adapters/webtasks");


module.exports = function (auth, taskId, next) {
  var query = {
    _id: taskId,
    user_id: auth.credentials._id,
  };
    
  return Mongo.db.remove("tasks", query)
    .then(function (removed) {
      // TODO: Transform response?
      return removed;
    })
      
    .nodeify(next);
};