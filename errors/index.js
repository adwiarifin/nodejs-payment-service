const HttpError = require('./HttpError');
const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const InternalServerError = require('./InternalServerError');

module.exports = {
    HttpError,
    BadRequestError,
    NotFoundError,
    InternalServerError,
}