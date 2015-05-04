var Lookup = require("object-path");
var Mongo = require("mongo-gyro");
var Promise = require("bluebird");


exports.init = function (server, options) {
  var mongoUrl = Lookup.get(options.config, "mongoUrl");
  
  exports.db = new Mongo(mongoUrl);
  
  // Return a promise for the connection to Mongo
  return exports.db.connect();
  
};
