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
  
  var cancelExpiredReservation = function (task) {
    if (task.reservation) {
      if (task.reservation.expires_at <= now) {
        var query = {
          "_id": task._id,
          "reservation.started_at": task.reservation.started_at
        };
        
        var update = {
          $unset: {
            reservation: true,
          },
        };
        
        return Mongo.db.findAndModify("tasks", query, update);
      } else {
        return; // Return undefined to be filtered out
      }
    }
    
    // No reservation
    return task;
  };
  
  var runTask = function (task) {
    var reserveTask = function () {
      var schedule = Cron.parseExpression(task.schedule);
      var nextScheduledAt = schedule.next();
      var query = {
        "_id": task._id,
        "reservation": null,
      };
      
      var update = {
        $set: {
          reservation: {
            started_at: now,
            expires_at: new Date(now.valueOf() + task.timeout),
          },
          next_scheduled_at: nextScheduledAt,
        },
      };
      
      return Mongo.db.findAndModify("tasks", query, update);
    };
    
    var handleTaskFailure = function (err) {
      var query = {
        "_id": task._id,
        "reservation.started_at": now,
      };
      
      var update = {
        $set: {
          last_response: {
            error: err,
          }
        },
        $unset: {
          reservation: true,
        },
        $inc: {
          errors_count: 1,
        },
      };
      
      return Mongo.db.findAndModify("tasks", query, update);
    };
    
    var updateTaskStats = function (result) {
      var query = {
        "_id": task._id,
        "reservation.started_at": now,
      };
      
      var update = {
        $set: {
          last_response: {
            body: result.body,
            headers: result.headers,
            statusCode: result.statusCode,
          }
        },
        $unset: {
          reservation: true,
        },
        $inc: {
          runs_count: 1,
        },
      };
      
      return Mongo.db.findAndModify("tasks", query, update)
        .return(result);
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
    .map(cancelExpiredReservation)
    .filter(Webtasks.isRunnable) // Remove tasks that still have valid reservations (set to undefined in cancelExpiredReservation)
    .map(runTask)
    .then(function (tasks) {
      return tasks;
    })
    .nodeify(next);
};