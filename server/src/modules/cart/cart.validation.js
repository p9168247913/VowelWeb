const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');

const createCartSchema = {
    body: Joi.object().keys({
        productd: Joi.custom(objectId).required(),
        userId: Joi.custom(objectId).required(),
    }),
};

module.exports = {
    createCartSchema,
};
