const mongoose = require('mongoose');
const Address = require('../address.model')

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addAddress = async (addressData) => {
    try {
        const addResult = await Address.create({ ...addressData });
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Unable to add Address", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addAddress
