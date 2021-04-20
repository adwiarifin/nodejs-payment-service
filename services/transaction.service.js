const Transaction = require('../models/Transaction');
const SuccessResponse = require('../responses/SuccessResponse');
const moment = require('moment');

class TransactionService {
    constructor() {

    }

    async getTransactions(query, user) {
        const userId = user.user_id;
        const limit = Number(query.limit) || 20;

        const transactions = await Transaction
            .find({ user_id: userId })
            .sort({ createdAt: -1 })
            .limit(limit);

        return new SuccessResponse(this.getTransactionResponse(transactions));
    }

    getTransactionResponse(values) {
        return values.map((value) => ({
            topup_id: value.topup_id,
            payment_id: value.payment_id,
            transfer_id: value.transfer_id,
            status: value.status,
            user_id: value.user_id,
            transaction_type: value.transaction_type,
            amount: value.amount,
            remarks: value.remarks,
            balance_before: value.balance_before,
            balance_after: value.balance_after,
            created_date: moment(value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }));
    }
}

module.exports = TransactionService;