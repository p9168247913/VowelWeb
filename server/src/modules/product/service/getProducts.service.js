const mongoose = require('mongoose');
const Product = require('../product.model');
const { number } = require('joi');
const baseUrl = process.env.baseUrl
/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getProducts = async (page, limit, filter, sort) => {
    try {
        const length = limit && parseInt(limit, 12) > 0 ? parseInt(limit, 12) : 12;
        const start = page && parseInt(page, 12) > 0 ? parseInt(page, 12) : 1;
        const skip = (start - 1) * length;

        let filterQuery = { active: true };
        let sortQuery = { _id: -1 };

        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;
                }
            }
        }
        if (sort != null) {
            sortQuery = sort;
        }

        if (filter?.name) {
            var regxName = new RegExp(`.*${filter.name}.*`, "i");
            filterQuery = { ...filterQuery, name: { $regex: regxName } };
        }

        const products = await Product.find(filterQuery).sort(sortQuery).skip(skip).limit(length);

        const totalResults = await Product.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);

        if (products) {
            return { data: products, totalPages, totalResults, page: start, limit: length, status: true, code: 200 };
        }
        else {
            return { data: "Product not found!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getProducts;
