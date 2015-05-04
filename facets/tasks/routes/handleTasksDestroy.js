var Boom = require("boom");
var Joi = require("joi");


module.exports = {
  auth: "auth0",
  validate: {
    params: {
      id: Joi.string().alphanum().required(),
    }
  },
  pre: [
    { method: "tasksDestroy(auth, params.id)", assign: "task" },
  ],
  handler: function (request, reply) {
    reply().code(201);
  },
};