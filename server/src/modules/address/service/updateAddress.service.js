const mongoose = require('mongoose');
const Address = require('../address.model')

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const updateAddress = async (addressData) => {
    const updateObj={
        addressLine1: addressData?.addressLine1,
		addressLine2: addressData?.addressLine2,
		city: addressData?.city,
		state: addressData?.state,
		country: addressData?.country,
		zipcode: addressData?.zipcode,
    }
    try {
        const seriesearchQuery = { active: true, _id: addressData.id };
        const addResult = await Address.findOneAndUpdate(seriesearchQuery, {...updateObj}, { new: true });
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Unable to update address!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = updateAddress
