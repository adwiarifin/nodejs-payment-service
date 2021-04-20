const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user_id: String,
    first_name: String,
    last_name: String,
    phone_number: String,
    address: String,
    pin: String,
    balance: Number,
}, { timestamps: true });

module.exports = mongoose.model('User', schema);