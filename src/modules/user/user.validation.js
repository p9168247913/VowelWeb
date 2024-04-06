const Joi = require('joi');
const { password, objectId, } = require('../../utils/customValidations');

const signupUser = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email().messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
			"string.email": `Email must be a valid mail`,
		}),
		password: Joi.string().required().custom(password).messages({
			"string.empty": `Password must contain value`,
			"any.required": `Password is a required field`
		}),
		profilePic: Joi.string().allow(""),
		role: Joi.string().required(),
		addressLine1: Joi.string().required(),
		addressLine2: Joi.string().allow(""),
		city: Joi.string().required(),
		state: Joi.string().required(),
		country: Joi.string().required(),
		zipcode: Joi.string().required(),
	}),
};

const updateUser = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email().messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
			"string.email": `Email must be a valid mail`,
		}),
		profilePic: Joi.string().allow(""),
		addressLine1: Joi.string().required(),
		addressLine2: Joi.string().allow(""),
		city: Joi.string().required(),
		state: Joi.string().required(),
		country: Joi.string().required(),
		zipcode: Joi.string().required(),
		addressId: Joi.custom(objectId).required(),
	}),
};

const loginWithEmail = {
	body: Joi.object().keys({
		email: Joi.string().email().required().messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
			"string.email": `Email must be a valid email`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password must contain value`,
			"any.required": `Password is a required field`,
		}),
	}),
};

const loginWithUsername = {
	body: Joi.object().keys({
		username: Joi.string().required().messages({
			"string.empty": `Username must contain value`,
			"any.required": `Username is a required field`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password must contain value`
		}),
	}),
};

module.exports = {
	signupUser,
	loginWithEmail,
	loginWithUsername,
	updateUser,
}