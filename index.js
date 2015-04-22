var Boom = require('boom');
var Promise = require('bluebird');
var _ = require('lodash');


exports.register = function (server, options, next) {
  Promise.promisifyAll(server);
  
  server.log('info', 'Registering webtask server plugin');
  
  var loadAdaptors = function () {
    return Promise.all([
      // require('./adapters/authentication').init(server, options),
    ]);
  };

  var loadPlugins = function () {
    return server.registerAsync([/*{
      register: require('./facets/auth'),
      options: options,
    }*/]);
  };
  
  
  
  
  loadAdaptors()
    .then(loadPlugins)
    .nodeify(next);
  
};

exports.register.attributes = {
  pkg: require('./package.json')
};