const Joi = require("joi");
const joiOptions = require("../config/joi.config");

// VALIDATE USER INPUT
function validateEmailPasswordInput(user) {
  // Validate user request inputs, min password length is 8
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(48).required(),
  });

  return schema.validate(user, joiOptions);
}

module.exports = validateEmailPasswordInput