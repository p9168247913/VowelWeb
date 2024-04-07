const mongoose = require('mongoose');
const Product = require('../product.model');

const deleteProduct = async (userId) => {
  try {
    // const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(userId) };
    const deleteResult = await Product.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) }, { active: false }, { new: true })
console.log(deleteResult);
    if (deleteResult) {
      return { data: "Product deleted successfully!!", status: true, code: 200 };
    }
    else {
      return { data: "Product Not Found!!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = deleteProduct
