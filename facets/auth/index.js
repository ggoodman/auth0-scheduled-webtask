var Auth0 = require("auth0");
var Joi = require("joi");
var Promise = require("bluebird");
var _ = require("lodash");


var internals = {};


exports.register = function (server, options, next) {
  Promise.promisifyAll(server);
  
  var err = internals.validateOptions(options);
  
  if (err) return next(err);
  
  var auth0 = new Auth0({
    domain: options.config.auth.domain,
    clientID: options.config.auth.clientID,
    clientSecret: options.config.auth.clientSecret,
  });
  
  server.bind({config: options.config, server: server});
  
  server.registerAsync([require("hapi-auth-jwt")])
    .then(function () {
      var validateFunc = function (token, callback) {
        
        auth0.getUser(token['sub'], function (err, user) {
          if (err) {
            server.log(['auth0', 'error'], err);
            
            return callback(err);
          }
          
          server.log(['auth0', 'info'], user.nickname);
          
          callback(null, true, user);
        });
      };
      
      server.auth.strategy("auth0", "jwt", {
        key: new Buffer(options.config.auth.clientSecret, 'base64'),
        validateFunc: validateFunc,
      });
      
      server.log(['auth0', 'info'], "Authentication configured");

    })
    .nodeify(next);
};


exports.register.attributes = {
  "name": "tasker-auth-plugin",
  "version": "1.0.0",
};


internals.authSchema = Joi.object().keys({
  domain: Joi.string().required(),
  clientID: Joi.string().required(),
  clientSecret: Joi.string().required(),
});

internals.validateOptions = function (options) {
  var result = Joi.validate(options.config.auth, internals.authSchema);
  
  return result.error;
};
