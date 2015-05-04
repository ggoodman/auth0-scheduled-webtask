var Boom = require("boom");
var Joi = require("joi");

var Schema = require("../../../schema");


module.exports = {
  auth: "auth0",
  validate: {
    payload: Schema.task.required(),
  },
  pre: [
    { method: "tasksCreate(headers, auth, payload)", assign: "task" },
  ],
  handler: function (request, reply) {
    reply(request.pre.task);
  },
};