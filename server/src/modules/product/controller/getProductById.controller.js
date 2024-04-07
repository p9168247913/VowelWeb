const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const ProductService = require('../service');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const { convertToJSON } = require("../../../utils/helper");

const getProductById = catchAsync(async (req, res) => {
    const {id} = req.params
    const list = await ProductService.getProductById(id);
    if (list.status) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      if(list.code==400){
        sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
      }
      else if(list.code==500){
        sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,list.data)
      }
      else{
        sendResponse(res,httpStatus.BAD_REQUEST,null,list.data)
      }
    }
});

module.exports = getProductById
