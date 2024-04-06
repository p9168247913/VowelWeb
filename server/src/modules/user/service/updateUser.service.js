const mongoose = require('mongoose');
const userModel = require('../user.model');
const updateAddress = require('../../address/service/updateAddress.service')

const updateUser = async (userId, reqBody) => {
	const addressObj = {
		addressLine1: reqBody?.addressLine1,
		addressLine2: reqBody?.addressLine2,
		city: reqBody?.city,
		state: reqBody?.state,
		country: reqBody?.country,
		zipcode: reqBody?.zipcode,
		id: reqBody?.addressId
	}
	const address = await updateAddress(addressObj)

	const userObj = {
		name: reqBody?.name,
		email: reqBody?.email,
		profileImage: reqBody?.profileImage,
		address: address?.data?.id,
	}
	try {
		const seriesearchQuery = { active: true, _id: userId };
		const updateResult = await userModel.findOneAndUpdate(seriesearchQuery, { ...userObj }, { new: true });
		if (updateResult) {
			return { data: updateResult, status: true, code: 200 };
		}
		else {
			return { data: "User Not Found!", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = updateUser
