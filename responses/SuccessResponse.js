const HttpResponse = require("./HttpResponse");

class SuccessResponse extends HttpResponse {
    constructor(data) {
        super(200, 'SUCCESS', data);
    }
}

module.exports = SuccessResponse;