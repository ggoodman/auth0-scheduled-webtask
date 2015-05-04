var Boom = require("boom");
var Cron = require("cron-parser");
var Promise = require("bluebird");

var Mongo = require("../../../adapters/mongodb");
var Webtasks = require("../../../adapters/webtasks");


module.exports = function (headers, auth, payload, next) {
  var id = Mongo.db.newId();
  
  var createTaskRecord = function (token) {
    var schedule = Cron.parseExpression(payload.schedule);
    var nextScheduledAt = schedule.next();
    
    var record = {
      _id: id,
      user_id: auth.credentials._id,
      name: payload.name,
      secrets: payload.secrets,
      code: payload.code,
      schedule: payload.schedule,
      last_response: null,
      next_scheduled_at: nextScheduledAt,
      reservation: null,
      timeout: Math.min(1000 * 10, Math.min(1000 * 60 * 60, payload.timeout * 1000)), // Between 10s and 1h
      errors_count: 0,
      runs_count: 0,
      token: token,
    };
    
    return Mongo.db.insert("tasks", record)
      .then(function (inserted) {
        // TODO: Transform response?
        return inserted[0];
      });
  };
  
  Webtasks.createToken(headers.authorization, id, payload.secrets)
    .then(createTaskRecord)
    .nodeify(next);
};