const Joi = require("joi");

exports.editUserDetials = {
  body: Joi.object({
      first_name       : Joi.string().trim().max(60).required(),
      last_name        : Joi.string().trim().max(60).required(),
      email           : Joi.string().trim().email().max(60).required()
  })
}

