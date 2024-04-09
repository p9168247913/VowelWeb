const mongoose = require('mongoose');
const Cart = require('../cart.model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addCart = async (cartData) => {
    try {
        const addResult = await Cart.create({ ...cartData});
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