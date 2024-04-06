const mongoose = require('mongoose');
const User = require('../user.model');
const { number } = require('joi');
const baseUrl = process.env.baseUrl
/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getUserById = async (id) => {
    try {

        const listResult = await User.findOne({_id:id})

        if (listResult) {
            return { data: listResult, status: true, code: 200 };
        }
        else {
            return { data: "User not found!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getUserById;
