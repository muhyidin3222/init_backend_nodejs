'use strict';

module.exports = () => {
    const controller = _controller('assets')
    const route = require('express').Router()
    route.get('/cssTempletePayment', (req, res, next) => controller.sendFile(req, res, next, "/css/payment_course.css"))
    route.get('/icon-invoice-error', (req, res, next) => controller.sendFile(req, res, next, "/img/invoice-error.svg"))
    route.get('/icon-invoice-success', (req, res, next) => controller.sendFile(req, res, next, "/img/invoice-success.svg"))
    route.get('/icon-invoice-onprocess', (req, res, next) => controller.sendFile(req, res, next, "/img/invoice-onprocess.svg"))
    return route
}