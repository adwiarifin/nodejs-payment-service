const uuid = require('uuid');
const moment = require('moment');
const Topup = require('../models/Topup');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SuccessResponse = require('../responses/SuccessResponse');
const { BadRequestError } = require("../errors");

class TopupService {
    constructor() {

    }

    async createTopup(body, user) {
        const userId = user.user_id;
        const userObj = await User.findOne({ user_id: userId });
        if (!userObj) {
            throw new BadRequestError('MISSMATCH', 'User ID not found.');
        }

        const balance = userObj.balance || 0;
        const amount = Number(body.amount);
        const after = balance + amount;
        userObj.balance = after;
        await userObj.save();

        const topupObj = new Topup({
            topup_id: uuid.v4(),
            user_id: userId,
            amount_top_up: amount,
            balance_before: balance,
            balance_after: after,
        });
        await topupObj.save();

        const transObj = new Transaction({
            topup_id: topupObj.topup_id,
            status: 'SUCCESS',
            user_id: userId,
            transaction_type: 'CREDIT',
            amount: amount,
            remarks: '',
            balance_before: balance,
            balance_after: after,
        });
        await transObj.save();

        return new SuccessResponse(this.createTopupResponse(topupObj));
    }

    createTopupResponse(value) {
        return {
            topup_id: value.topup_id,
            amount_top_up: value.amount_top_up,
            balance_before: value.balance_before,
            balance_after: value.balance_after,
            created_at: moment(value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
    }
}

module.exports = TopupService;