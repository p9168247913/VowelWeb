const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer')

const productSchema = new mongoose.Schema({
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

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Department');
    doc.productNo = `AT` + (1000 + doc.seqId);
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product
