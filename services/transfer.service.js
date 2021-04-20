const uuid = require('uuid');
const moment = require('moment');
const kue = require('kue');

const config = require('../config');
const Transfer = require('../models/Transfer');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SuccessResponse = require('../responses/SuccessResponse');
const { BadRequestError } = require("../errors");

class TransferService {
    constructor() {
        
    }

    async createTransfer(body, user) {
        const userOriginId = user.user_id;
        const userDestinationId = body.target_user;
        const amount = Number(body.amount);
        const remarks = body.remarks;
        if (userOriginId === userDestinationId) {
            throw new BadRequestError('BADREQUEST', 'Transfer User cannot be the same');
        }

        const userOrigin = await User.findOne({ user_id: userOriginId });
        if (!userOrigin) {
            throw new BadRequestError('BADREQUEST', 'User Origin not found');
        }

        const userDestination = await User.findOne({ user_id: userDestinationId });
        if (!userDestination) {
            throw new BadRequestError('BADREQUEST', 'User Destination not found');
        }

        if (userOrigin.balance < amount) {
            throw new BadRequestError('BADREQUEST', 'Balance is not enough');
        }

        const transferId = uuid.v4();
        const balance = userOrigin.balance;
        const after = balance - amount;

        const queue = kue.createQueue({ redis: config.redis });
        const data = {
            transfer_id: transferId,
            amount: amount,
            remarks: remarks,
            balance_before: balance,
            balance_after: after,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        queue.create('transfer_queue', {
            title: `Transfer: ${transferId}`,
            origin: userOriginId,
            destination: userDestinationId,
            data: data,
        }).save();

        return new SuccessResponse(data);
    }

    async processQueue(job, done) {
        const { origin, destination, data } = job.data;

        const userOrigin = await User.findOne({ user_id: origin });
        const userOriginBalance = userOrigin.balance || 0;
        const userOriginBalanceAfter = userOriginBalance - data.amount;

        const userDestination = await User.findOne({ user_id: destination });
        const userDestinationBalance = userDestination.balance || 0;
        const userDestinationBalanceAfter = userDestinationBalance + data.amount;

        userOrigin.balance = userOriginBalanceAfter;
        userDestination.balance = userDestinationBalanceAfter;

        const transObj = new Transfer(data);

        const transOriginObj = new Transaction({
            transfer_id: data.transferId,
            status: 'SUCCESS',
            user_id: origin,
            transaction_type: 'DEBIT',
            amount: data.amount,
            remarks: data.remarks,
            balance_before: userOriginBalance,
            balance_after: userOriginBalanceAfter,
        });

        const transDestinationObj = new Transaction({
            transfer_id: data.transferId,
            status: 'SUCCESS',
            user_id: destination,
            transaction_type: 'CREDIT',
            amount: data.amount,
            remarks: data.remarks,
            balance_before: userDestinationBalance,
            balance_after: userDestinationBalanceAfter,
        });

        await Promise.all([
            userOrigin.save(),
            userDestination.save(),
            transObj.save(),
            transOriginObj.save(),
            transDestinationObj.save(),
        ]);

        done();
    }
}

module.exports = TransferService;