var Boom = require("boom");
var Cron = require("cron-parser");
var Promise = require("bluebird");

var Mongo = require("../../../adapters/mongodb");
var Webtasks = require("../../../adapters/webtasks");


module.exports = function (next) {
  var now = new Date();
  var query = {
    next_scheduled_at: {
      $lt: now,
    },
  };
  
  
  var runTask = function (task) {
    var reserveTask = function () {
      var query = {
        _id: task._id,
        next_scheduled_at: task.next_scheduled_at,
      };
      
      var update = {
        $set: {
          last_started_at: now,
        },
      };
      
      return Mongo.db.findAndModify("tasks", query, update);
    };
    
    var handleTaskFailure = function (err) {
      var query = {
        _id: task._id,
        last_started_at: now,
        next_scheduled_at: task.next_scheduled_at,
      };
      
      var update = {
        $set: {
          last_started_at: null,
          last_response: {
            error: err,
          }
        },
        $inc: {
          errors_count: 1,
        },
      };
      
      return Mongo.db.findAndModify("tasks", query, update);
    };
    
    var updateTaskStats = function (result) {
      var schedule = Cron.parseExpression(task.schedule);
      var nextScheduledAt = schedule.next();
      
      var query = {
        _id: task._id,
        next_scheduled_at: task.next_scheduled_at,
      };
      
      var update = {
        $set: {
          next_scheduled_at: nextScheduledAt,
          last_started_at: null,
          last_response: {
            body: result.body,
            headers: result.headers,
            statusCode: result.statusCode,
          }
        },
        $inc: {
          runs_count: 1,
        },
      };
      
      return Mongo.db.findAndModify("tasks", query, update);
    };
    
    return reserveTask(task)
      .then(Webtasks.run)
      .catch(handleTaskFailure)
      .then(updateTaskStats)
      .catch(function (err) {
        throw err;
      });
  };
  
  Mongo.db.find("tasks", query)
    .filter(Webtasks.isRunnable)
    .map(runTask)
    .then(function (tasks) {
      return tasks;
    })
    .nodeify(next);
};