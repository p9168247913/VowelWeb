const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer')

const addressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    seqId: {
        type: Number,
    }
});

addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);

addressSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('address');
    doc.addressNo = `AT` + (1000 + doc.seqId);
    next();
});

const Address = mongoose.model('address', addressSchema);
module.exports = Address
