'use strict';

module.exports = () => {
    const controller = _controller('auth')
    const route = require('express').Router()

    route.post('/login', controller.post)
    route.post('/logOut', controller.logOut)
    route.post('/loginByAdmin', controller.loginByAdmin)
    route.post('/fbDeleteAccount', controller.fbDeleteAccount)
    return route
}