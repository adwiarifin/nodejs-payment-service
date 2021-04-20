const HttpError = require('./HttpError');

module.exports = class BadRequestError extends HttpError {
    constructor(code, message) {
        super(400, code, message);
    }
}