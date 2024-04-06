const mongoose = require('mongoose');
const User = require('../user.model');
const { number } = require('joi');
const Address = require('../../address/address.model')
const baseUrl = process.env.baseUrl
/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getAlluser = async (page, limit, filter, sort) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;

        let filterQuery = { active: true, role: { $ne: 'admin' } }
        let sortQuery = { _id: -1 }

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
            sortQuery = sort
        }

        if (filter?.role) {
            filterQuery = { ...filterQuery, role: filter?.role };
        }
        if (filter?.name) {
            var regxName = new RegExp(`.*${filter.name}.*`, "i");
            filterQuery = { ...filterQuery, name: { $regex: regxName } };
        }

        // Exclude password and profile pic fields
        const projection = { password: 0, profileImage: 0 };

        const listResult = await User.aggregate([
            { $match: filterQuery },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: length },
            {
                $lookup: {
                    from: "addresses",
                    localField: "address",
                    foreignField: "_id",
                    as: "address"
                }
            },
            {
                $unwind:"$address"
            },
            {
                $project: {
                    password: 0,
                }
            },
        ]);
        // const listResult = await User.find(filterQuery).select(projection).sort(sortQuery).skip(skip).limit(length)

        const totalResults = await User.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);

        const usersWithCompleteImageUrls = listResult.map(user => {
            const profileImageUrl = user.profileImage ? baseUrl + user.profileImage : null;
            return { ...user, profileImage:profileImageUrl };
        });

        if (listResult) {
            return { data: usersWithCompleteImageUrls, totalResults, totalPages, page: start, limit: length, status: true, code: 200 };
        }
        else {
            return { data: "User not found!", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAlluser;
