const mongoose = require('mongoose');
const Cart = require('../cart.model');
const { number } = require('joi');
/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getCartById = async (id) => {
    try {
        let filterQuery = { active: true, userId: new mongoose.Types.ObjectId(id) }

        const listResult = await Cart.aggregate([
            { $match: filterQuery },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $unwind: "$products"
            }
        ]);

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

module.exports = getCartById;
