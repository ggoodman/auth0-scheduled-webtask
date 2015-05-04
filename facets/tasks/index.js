var Path = require("path");
var Promise = require("bluebird");
var _ = require("lodash");


exports.register = function (server, options, next) {
  Promise.promisifyAll(server);
  
  server.bind({config: options.config, server: server});
  
  server.method("tasksCreate", require("./methods/tasksCreate"), { callback: true });
  server.method("tasksDestroy", require("./methods/tasksDestroy"), { callback: true });
  server.method("tasksFetch", require("./methods/tasksFetch"), { callback: true });
  server.method("tasksFetchCode", require("./methods/tasksFetchCode"), { callback: true });
  server.method("tasksList", require("./methods/tasksList"), { callback: true });
  server.method("tasksRunScheduled", require("./methods/tasksRunScheduled"), { callback: true });
  
  server.route({ method: "POST", path: "/tasks", config: require("./routes/handleTasksCreate") });
  server.route({ method: "GET", path: "/tasks", config: require("./routes/handleTasksList") });
  server.route({ method: "GET", path: "/tasks/{id}", config: require("./routes/handleTasksFetch") });
  server.route({ method: "DELETE", path: "/tasks/{id}", config: require("./routes/handleTasksDestroy") });
  server.route({ method: "GET", path: "/tasks/{id}/code", config: require("./routes/handleTasksFetchCode") });
  
  setInterval(function () {
    server.methods.tasksRunScheduled(function (err, results) {
      if (err) server.log(['task', 'error'], err);
      else {
        var totalTime = _.sum(results, "time");
        
        server.log(['task', 'info'], {
          ok: results.length,
          stats: {
            totalTime: totalTime,
            averageTime: totalTime / results.length
          },
        });
      }
      //console.log("tasksRunScheduled", err, results);
    });
    
  }, 1000 * 10); // Every 10 seconds
  
  next();
};


exports.register.attributes = {
  "name": "tasker-tasks-plugin",
  "version": "1.0.0",
};