const Joi = require("joi");
const joiOptions = require("../config/joi.config");

// VALIDATE USER INPUT FOR SIGN-UP
function validateSignUpInput(user) {
  // Validate user request inputs, min password length is 8
  const schema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    passwordConfirm: Joi.string().min(8).max(30).required(),
  });

  return schema.validate(user, joiOptions);
}

// VALIDATE USER INPUT FOR SIGN-IN
function validateEmailPasswordInput(user) {
  // Validate user request inputs, min password length is 8
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  });

  return schema.validate(user, joiOptions);
}

module.exports = { validateEmailPasswordInput, validateSignUpInput };
