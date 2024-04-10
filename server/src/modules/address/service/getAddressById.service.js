const mongoose = require('mongoose');
const Address = require('../address.model');
const { number } = require('joi');
/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getAddressById = async (id) => {
    try {

        const listResult = await Address.findOne({_id:id})

        if (listResult) {
            return { data: listResult, status: true, code: 200 };
        }
        else {
            return { data: "Product not found!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAddressById;
