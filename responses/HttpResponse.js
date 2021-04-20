class HttpResponse {
    constructor(httpCode, status, data) {
        this.httpCode = httpCode;
        this.status = status;
        this.data = data;
    }

    getHttpCode() {
        return this.httpCode;
    }

    getData() {
        return {
            status: this.status,
            result: this.data,
        }
    }
}

module.exports = HttpResponse;