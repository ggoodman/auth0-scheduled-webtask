var Boom = require("boom");
var Joi = require("joi");


module.exports = {
  auth: false,
  validate: {
    params: {
      id: Joi.string().alphanum().required(),
    }
  },
  pre: [
    { method: "tasksFetchCode(params.id)", assign: "task" },
  ],
  handler: function (request, reply) {
    reply(request.pre.task.code)
      .type("text/javascript");
  },
};