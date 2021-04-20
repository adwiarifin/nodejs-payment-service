const HttpError = require('./HttpError');

module.exports = class InternalError extends HttpError {
    constructor(message = 'Internal Server Error') {
        super(500, 'INTERNAL_SERVER_ERROR', message);
    }
}