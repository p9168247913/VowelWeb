const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const CartService = require('../service')

const addCart = async(req, res) =>{
    const { productId, userId } = await pick(req.body, ['productId','userId'])
    const addResult = await CartService.addCart({ productId, userId});
    if (addResult.status) {
        sendResponse(res, httpStatus.OK, addResult, null);
    } else {
        if (addResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, addResult.data);
        }
        else if (addResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, addResult.data)
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, addResult.data)
        }
    }
}

module.exports = addCart