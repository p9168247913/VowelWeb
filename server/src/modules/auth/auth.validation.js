const Joi = require('joi');
const { password,emailCustom } = require('../../validations/custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
   
    name: Joi.string().required().messages({
      "string.empty": `Name must contain value`,
      "any.required": `Name is a required field`
    }),
    postalCode: Joi.string().required(),
    city: Joi.allow(""),
    phoneNo: Joi.string().required(),
    streetAddress: Joi.string().required(),
    role:Joi.string().required(),
    province:Joi.string().required()
  }),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    name: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(emailCustom).messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`
    }),
  }),
};

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    
  }),
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const socialLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  resetPasswordValidation,
  adminLogin,
  socialLogin,
  signup
};
