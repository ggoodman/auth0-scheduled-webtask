var Promise = require("bluebird");
var Http = require("http-as-promised");


var internals = {};


internals.webtaskApiUrl = "https://webtask.it.auth0.com/api";


exports.init = function (server, options) {
  internals.publicUrl = options.config.publicUrl;
  internals.webtaskToken = options.config.webtaskToken;
  internals.webtaskContainer = options.config.webtaskContainer;
};

exports.createToken = function (authorization, id, secrets) {
  var payload = {
    url: internals.publicUrl + '/api/tasks/' + id + '/code',
    ten: internals.webtaskContainer,
    pb: 1,
    dr: 1,
    ectx: secrets,
  };
  
  // TODO: Temporarily hard-coded to T1 token
  // return Promise.resolve(internals.webtaskToken);
  
  return Http.post(internals.webtaskApiUrl + "/tokens/issue", {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + internals.webtaskToken,
    },
    resolve: "body",
  });
};

exports.isRunnable = function (task) {
  return task && !task.reservation; // Do not reserve if already started
};

exports.run = function (task) {
  var startTime = Date.now();
  
  return Http.post(internals.webtaskApiUrl + "/run/" + internals.webtaskContainer, {
    headers: {
      'Authorization': "Bearer " + task.token,
    },
    body: task.code,
  })
    .timeout(1000 * 60 * 5)
    .spread(function (response, body) {
      return {
        headers: response.headers,
        statusCode: response.statusCode,
        body: body,
        time: Date.now() - startTime,
      };
    });
};