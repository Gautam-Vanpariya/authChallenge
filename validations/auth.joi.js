const Joi = require("joi");

//  =========== AUTH PAGE ======================
exports.login = {
  body: Joi.object({
    email    : Joi.string().trim().max(60).email().lowercase(),
    password : Joi.string().trim().max(60).required(),
  })
};

exports.register = {
    body: Joi.object({
      first_name           : Joi.string().trim().max(60).required(),
      last_name            : Joi.string().trim().max(60).required(),
      email                : Joi.string().email().trim().lowercase().max(60).required(),
      password             : Joi.string().trim().min(5).max(60).required(),
      confirm_password     : Joi.string().valid(Joi.ref("password")).required(),
    })
  };
  

exports.forgotPassword = {
  body: Joi.object({
    email   : Joi.string().trim().email().required()
  })
};

exports.resetLink = {
  query: Joi.object({
    id : Joi.string().trim().required()
  })
};

exports.resetPassword = {
  body: Joi.object({
    linkid              : Joi.string().trim().allow("").optional(),
    password            : Joi.string().trim().min(5).max(60).required(),
    confirm_password    : Joi.string().valid(Joi.ref("password")).required(),
  })
};
