const mongoose = require('mongoose');
const Cart = require('../cart.model');

const deleteProduct = async (userId) => {
  try {
    // const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(userId) };
    const deleteResult = await Cart.findOneAndDelete({ _id: new mongoose.Types.ObjectId(userId) })
    if (deleteResult) {
      return { data: "Product removed from cart!!", status: true, code: 200 };
    }
    else {
      return { data: "Product Not Found!!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = deleteProduct
