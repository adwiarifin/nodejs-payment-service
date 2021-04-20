const HttpError = require('./HttpError');

module.exports = class NotFoundError extends HttpError {
    constructor() {
        super(404, 'NOT_FOUND', 'Not Found');
    }
}