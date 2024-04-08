const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer')

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    productImage:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    seqId: {
        type: Number,
    }
}, {
    timestamps: true,
});

cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

cartSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Cart');
    doc.cartNo = `AT` + (1000 + doc.seqId);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart
