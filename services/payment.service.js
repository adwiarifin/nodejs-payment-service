const uuid = require('uuid');
const moment = require('moment');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SuccessResponse = require('../responses/SuccessResponse');
const { BadRequestError } = require("../errors");

class TransferService {
    constructor() {

    }

    async createPayment(body, user) {
        const userId = user.user_id;
        const userObj = await User.findOne({ user_id: userId });
        const amount = Number(body.amount);
        const remarks = body.remarks;
        const paymentId = uuid.v4();
        if (!userObj) {
            throw new BadRequestError('MISSMATCH', 'User ID not found.');
        }

        if (userObj.balance < amount) {
            throw new BadRequestError('BADREQUEST', 'Balance is not enough');
        }

        const balance = userObj.balance || 0;
        const after = balance - amount;

        userObj.balance = after;
        await userObj.save();

        const paymentObj = new Payment({
            payment_id: paymentId,
            user_id: userId,
            amount: amount,
            remarks: remarks,
            balance_before: balance,
            balance_after: after,
        });
        await paymentObj.save();

        const transObj = new Transaction({
            payment_id: paymentId,
            status: 'SUCCESS',
            user_id: userId,
            transaction_type: 'DEBIT',
            amount: amount,
            remarks: remarks,
            balance_before: balance,
            balance_after: after,
        });
        await transObj.save();

        return new SuccessResponse(this.createPaymentResponse(paymentObj));
    }

    createPaymentResponse(value) {
        return {
            payment_id: value.payment_id,
            amount: value.amount,
            remarks: value.remarks,
            balance_before: value.balance_before,
            balance_after: value.balance_after,
            created_date: moment(value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
    }
}

module.exports = TransferService;