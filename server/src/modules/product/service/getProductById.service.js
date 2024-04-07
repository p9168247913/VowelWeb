const mongoose = require('mongoose');
const Product = require('../product.model');
const { number } = require('joi');
const baseUrl = process.env.baseUrl
/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getProductById = async (id) => {
    try {

        const listResult = await Product.findOne({_id:id})

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

module.exports = getProductById;
