var Promise = require("bluebird");
var Webpack = require("webpack");


exports.init = function (server, options) {
  var config = require("../webpack.config");
  var compiler = Webpack(config);
  var statsOptions = {
    colors: true,
    hash: false,
    timings: true,
    assets: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    cached: false,
    reasons: false,
    source: false,
    errorDetails: true,
    chunkOrigins: false,
  };
  
  // Single promise resolution, allowing webpack to watch assets
  var resolved = false;
  
  return new Promise(function (resolve, reject) {
    server.log("info", "Starting asset build...");
    
    compiler.watch(1000, function (err, stats) {
      if (err) {
        server.log("error", "Asset build failed: " + err.message);
      }
      
      if (!resolved && err) {
        reject(err);
      } else if (!resolved) {
        resolve(stats);
        resolved = true;
      }
      
      server.log("info", "Asset build completed: " + stats.toString(statsOptions));
    });
  });
};
