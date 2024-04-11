const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');

const createOrdertSchema = {
    body: Joi.object().keys({
        address: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        products: Joi.array().items(Joi.string()).required(),
        userId: Joi.string().required(),
    }),
};

module.exports = {
    createOrdertSchema,
};
