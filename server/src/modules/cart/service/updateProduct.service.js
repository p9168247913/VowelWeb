const mongoose = require('mongoose');
const Product = require('../product.model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const updateProduct = async (id, productData) => {
    try {
        const searchQuery = { active: true, _id: id };
        const addResult = await Product.findOneAndUpdate(
            searchQuery,
            { name: productData.name, price: productData.price, description: productData.description, productImage: productData.productImage},
            { new: true }
        );

        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Unable to update product!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = updateProduct;