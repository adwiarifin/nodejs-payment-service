const mongoose = require('mongoose');

const schema = mongoose.Schema({
    transfer_id: String,
    origin_user: String,
    target_user: String,
    amount: Number,
    remarks: String,
    balance_before: Number,
    balance_after: Number,
}, { timestamps: true });

module.exports = mongoose.model('Transfer', schema);