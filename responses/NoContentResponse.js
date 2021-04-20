const HttpResponse = require("./HttpResponse");

class NoContentResponse extends HttpResponse {
    constructor() {
        super(204, {});
    }
}

module.exports = NoContentResponse;