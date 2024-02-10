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

// VALIDATE USER INPUT FOR SIGN-UP
function validateProductUpload(product) {
  // Validate user request inputs, min password length is 8
  const schema = Joi.object({
    productName: Joi.string().required(),
    productDetails: Joi.string().required(),
    productPrice: Joi.number().required(),
    vendorName: Joi.string().min(5).max(30).required(),
    vendorAddress: Joi.string().required(),
  });

  return schema.validate(product, joiOptions);
}

// VALIDATE USER INPUT FOR SIGN-UP
function validateAddToCart(cart) {
  // Validate user request inputs, min password length is 8
  const schema = Joi.object({
    productId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("must be an oid")
      .required(),
    quantity: Joi.number().required(),
  });

  return schema.validate(cart, joiOptions);
}

// VALIDATE USER ROLE UPDATE
function validateUserRoleUpdate(user) {
  const schema = Joi.object({
    role: Joi.string().required(),
    address: Joi.string().min(8).required(),
    phoneNumber: Joi.string().min(11).max(14),
  });

  return schema.validate(user, joiOptions);
}

//Validate ids to delete products
function validateIds(ids) {
  const schema = Joi.object({
    productIds: Joi.array()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("must be an oid")
      .required(),
  });

  return schema.validate(ids, joiOptions);
}
// .regex(/^[0-9a-fA-F]{24}$/, message)

module.exports = {
  validateEmailPasswordInput,
  validateSignUpInput,
  validateProductUpload,
  validateAddToCart,
  validateUserRoleUpdate,
  validateIds,
};
