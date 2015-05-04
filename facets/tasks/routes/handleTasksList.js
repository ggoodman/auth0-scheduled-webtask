var Boom = require("boom");
var Joi = require("joi");


module.exports = {
  auth: "auth0",
  pre: [
    { method: "tasksList(auth)", assign: "tasks" },
  ],
  handler: function (request, reply) {
    reply(request.pre.tasks);
  },
};