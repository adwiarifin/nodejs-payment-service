const config = require('../config');
const mongoose = require('mongoose');
const kue = require('kue');
const queue = kue.createQueue({ redis: config.redis });
const TransferService = require('../services/transfer.service');
const transferService = new TransferService();
mongoose.connect(config.mongo.database_url, { useNewUrlParser: true, useUnifiedTopology: true });

queue.process('transfer_queue', (job, done) => {
    console.log(`Processing Transfer ${job.data.data.transfer_id}`);
    transferService.processQueue(job, done);
});