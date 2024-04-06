const httpStatus = require('http-status');
const fs = require('fs').promises;
const path = require('path');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const adminServices = require('../service');
// const img = require('../../../../uploads/')

const updateUser = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id']);

    const { name, email, addressLine1, addressLine2, city, state, country, zipcode, addressId } = await pick(req.body, ['name', 'email', 'phoneNo', 'role', 'dob', 'gender', 'department', 'addressLine1', 'adddressLine2', 'city', 'state', 'country', 'zipcode', 'addressId']);

    let profileImage;
    if (req.file) {
        profileImage = req.file.filename;
        const user = await adminServices.getUserById(id);
        if (user && user.data.profileImage) {
            const baseDirectory = path.resolve(__dirname, '../../../../');
            const imagePath = path.join(baseDirectory, user.data.profileImage);
            await fs.unlink(imagePath);
        }
    }

    const updatedProfileImage = profileImage ? `/uploads/User/${profileImage}` : undefined;

    const updateResult = await adminServices.updateUser(id, { name, email, profileImage: updatedProfileImage, addressLine1, addressLine2, city, state, country, zipcode, addressId });
    if (updateResult.status) {
        sendResponse(res, httpStatus.OK, updateResult, null);
    } else {
        if (updateResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
        }
        else if (updateResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, updateResult.data)
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data)
        }
    }
});

module.exports = updateUser;
