var Path = require("path");
var Promise = require("bluebird");
var _ = require("lodash");


exports.register = function (server, options, next) {
  Promise.promisifyAll(server);
  
  server.bind({config: options.config, server: server});
  
  server.path(Path.join(__dirname, '..', '..', 'web', 'static'));
  
  // server.method("name", require("./path"), { callback: false });
  
  server.route({ method: "GET", path: "/favicon.ico", config: require("./routes/handleFavicon") });
  server.route({ method: "GET", path: "/robots.txt", config: require("./routes/handleRobots") });
  server.route({ method: "GET", path: "/{any*}", config: require("./routes/handleSPA") });
  server.route({ method: "GET", path: "/static/{any*}", config: require("./routes/handleStatic") });
  server.route({ method: "GET", path: "/ace/{any*}", config: require("./routes/handleAce") });
  
  next();
};


exports.register.attributes = {
  "name": "tasker-assets-plugin",
  "version": "1.0.0",
};