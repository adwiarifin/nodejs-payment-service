const { response } = require("../app");
const User = require('../models/User');
const SuccessResponse = require('../responses/SuccessResponse');
const { BadRequestError } = require("../errors");
const config = require('../config');
const uuid = require('uuid');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserService {
    constructor() {

    }

    async login(body) {
        const user = await User.findOne({ phone_number: body.phone_number });
        if (!user) {
            throw new BadRequestError('MISSMATCH', 'Phone number not found.');
        }

        const valid = await bcrypt.compare(body.pin, user.pin);
        if (!valid) {
            throw new BadRequestError('MISSMATCH', 'Phone number and pin doesn’t match.');
        }

        return new SuccessResponse(this.loginResponse(user));
    }

    loginResponse(user) {
        const response = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            address: user.address,
        }
        return this.generateToken(response);
    }

    generateToken(data) {
        return {
            access_token: this.createAccessToken(data),
            refresh_token: this.createRefreshToken(data),
        }
    }

    createAccessToken(data) {
        const { secret, ttl } = config.token.access;
        return this.createToken(data, secret, ttl);
    }

    createRefreshToken(data) {
        const { secret, ttl } = config.token.refresh;
        return this.createToken(data, secret, ttl);
    }

    createToken(data, secret, expiresIn) {
        return jwt.sign(data, secret, { expiresIn });
    }

    async register(body) {
        const exists = await User.findOne({ phone_number: body.phone_number });
        if (exists) {
            throw new BadRequestError('DUPLICATE', 'Phone Number already registered');
        }

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(body.pin, salt);
        const user = new User({
            user_id: uuid.v4(),
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
            address: body.address,
            pin: hash,
            balance: 0,
        });
        await user.save();
        return new SuccessResponse(this.registerResponse(user));
    }

    registerResponse(value) {
        return {
            user_id: value.user_id,
            first_name: value.first_name,
            last_name: value.last_name,
            phone_number: value.phone_number,
            address: value.address,
            created_date: moment(value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
    }

    async updateProfile(body, reqUser) {
        const user = await User.findOne({ user_id: reqUser.user_id });
        if (!user) {
            throw new BadRequestError('MISSMATCH', 'Phone number not found.');
        }

        user.first_name = body.first_name;
        user.last_name = body.last_name;
        user.address = body.address;
        await user.save();

        return new SuccessResponse(this.updateProfileResponse(user));
    }

    updateProfileResponse(value) {
        return {
            user_id: value.user_id,
            first_name: value.first_name,
            last_name: value.last_name,
            address: value.address,
            updated_date: moment(value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
    }
}

module.exports = UserService;