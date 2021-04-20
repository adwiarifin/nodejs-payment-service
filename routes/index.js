const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth');
const { 
    UserService,
    PaymentService,
    TopupService,
    TransferService,
    TransactionService,
} = require('../services');
const userService = new UserService();
const topupService = new TopupService();
const transferService = new TransferService();
const transactionService = new TransactionService();
const paymentService = new PaymentService();

router.get('/', async (req, res) => {
    res.json({
        status: 'Node.js API Working',
        message: 'Welcome to Node.js API',
    })
});

router.post('/register', async (req, res, next) => {
    try {
        const { body } = req;
        const result = await userService.register(body);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { body } = req;
        const result = await userService.login(body);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

router.post('/topup', authenticateToken, async (req, res, next) => {
    try {
        const { body, user } = req;
        const result = await topupService.createTopup(body, user);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

router.post('/pay', authenticateToken, async (req, res, next) => {
    try {
        const { body, user } = req;
        const result = await paymentService.createPayment(body, user);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

router.post('/transfer', authenticateToken, async (req, res, next) => {
    try {
        const { body, user } = req;
        const result = await transferService.createTransfer(body, user);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

router.get('/transactions', authenticateToken, async (req, res, next) => {
    try {
        const { query, user } = req;
        const result = await transactionService.getTransactions(query, user);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    res.json(req.user);
});

router.put('/profile', authenticateToken, async (req, res, next) => {
    try {
        const { body, user } = req;
        const result = await userService.updateProfile(body, user);
        res
            .status(result.getHttpCode())
            .send(result.getData());
    } catch (e) {
        next(e);
    }
});

module.exports = router;