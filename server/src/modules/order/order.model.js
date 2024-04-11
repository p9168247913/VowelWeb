const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const orderSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    products: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
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

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Cart');
    doc.orderNo = `AT` + (1000 + doc.seqId);
    next();
});

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;
