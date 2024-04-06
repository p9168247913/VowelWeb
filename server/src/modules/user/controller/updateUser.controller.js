const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const adminServices = require('../service');

const updateUser = catchAsync(async (req, res) => {
    const { id, } = await pick(req.params, ['id'])

    const { name, email,addressLine1, addressLine2, city, state, country, zipcode, addressId } = await pick(req.body, ['name', 'email', 'phoneNo', 'role', 'dob', 'gender', 'department', 'addressLine1', 'adddressLine2', 'city',  'state', 'country', 'zipcode', 'addressId'])
    const profileImage = req.file?.filename;
    const updateResult = await adminServices.updateUser(id, { name, email, profileImage, addressLine1, addressLine2, city, state, country, zipcode, addressId });
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

module.exports = updateUser
