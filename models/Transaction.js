const mongoose = require('mongoose');

const schema = mongoose.Schema({
    topup_id: String,
    payment_id: String,
    transfer_id: String,
    status: String,
    user_id: String,
    transaction_type: String,
    amount: Number,
    remarks: String,
    balance_before: Number,
    balance_after: Number,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', schema);