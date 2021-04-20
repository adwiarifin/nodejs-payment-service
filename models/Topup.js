const mongoose = require('mongoose');

const schema = mongoose.Schema({
    topup_id: String,
    user_id: String,
    amount_top_up: Number,
    balance_before: Number,
    balance_after: Number,
}, { timestamps: true });

module.exports = mongoose.model('Topup', schema);