const mongoose = require('mongoose');

const schema = mongoose.Schema({
    payment_id: String,
    user_id: String,
    amount: Number,
    remarks: String,
    balance_before: Number,
    balance_after: Number,
}, { timestamps: true });

module.exports = mongoose.model('Payment', schema);