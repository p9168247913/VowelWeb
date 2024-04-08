const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const ProductService = require('../service')
const upload = require('../../../middlewares/multer');

const addProduct = async(req, res) =>{
    // const productImage = req.file?.filename
    const { name, price, description, productImage } = await pick(req.body, ['name', 'price', 'description', 'productImage'])
    const addResult = await ProductService.addProduct({ name, price, description, productImage});
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

module.exports = addProduct