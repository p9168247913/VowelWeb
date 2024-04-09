const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const ProductService = require('../service');
const fs = require('fs').promises;
const path = require('path');

const updateProduct = async(req, res) =>{
    const {id} = req.params
    const { name, price, description } = await pick(req.body, ['name', 'price', 'description'])

    let productImage;
    if (req.file) {
        productImage = req.file.filename;
        const product = await ProductService.getProductById(id);
        if (product && product.data.productImage) {
            const baseDirectory = path.resolve(__dirname, '../../../../');
            const imagePath = path.join(baseDirectory, product.data.productImage);
            await fs.unlink(imagePath);
        }
    }

    const updatedProfileImage = productImage ? `/uploads/products/${productImage}` : undefined;

    const addResult = await ProductService.updateProduct(id, { name, price, description, productImage:updatedProfileImage});
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

module.exports = updateProduct
