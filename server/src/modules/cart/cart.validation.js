const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');

const createCartSchema = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        productImage: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().required(),
    }),
};

module.exports = {
    createCartSchema,
};
