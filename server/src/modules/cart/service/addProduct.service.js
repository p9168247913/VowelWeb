const mongoose = require('mongoose');
const Product = require('../product.model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addCart = async (productData) => {
    try {
        const addResult = await Product.create({ ...productData});
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Unable to add to cart!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addCart;