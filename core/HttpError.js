"use strict"

const HttpError = function(message, statusCode) {
    this.message = message
    this.statusCode = statusCode
}

HttpError.prototype = new Error()

module.exports = HttpError