var Boom = require('boom');
var Path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');


exports.register = function (server, options, next) {
  Promise.promisifyAll(server);
  
  server.log('info', 'Registering webtask server plugin');
  
  var loadAdaptors = function () {
    return Promise.all([
      require('./adapters/assets').init(server, options),
      require('./adapters/mongodb').init(server, options),
      require('./adapters/webtasks').init(server, options),
    ]);
  };

  var loadApiPlugins = function () {
    return server.registerAsync([{
      register: require('./facets/auth'),
      options: options,
    }, {
      register: require('./facets/tasks'),
      options: options,
    }], {
      routes: {
        prefix: "/api", // All API endpoints live in this test server under /api
      }
    });
  };

  var loadWebPlugins = function () {
    return server.registerAsync([{
      register: require('./facets/assets'),
      options: options,
    }]);
  };
  
  
  
  
  loadAdaptors()
    .then(loadApiPlugins)
    .then(loadWebPlugins)
    .nodeify(next);
  
};

exports.register.attributes = {
  pkg: require('./package.json')
};