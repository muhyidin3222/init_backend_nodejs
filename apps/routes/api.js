'use strict';

module.exports = () => {
    const controller = _controller('paymentBca')
    const route = require('express').Router()
    route.post('/oauth/token', controller.getTokenBca)
    return route
}