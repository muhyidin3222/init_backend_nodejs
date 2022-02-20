'use strict';

module.exports = () => {
    const controller = _controller('upload')
    const route = require('express').Router()
    route.post('/byUser', controller.uploadByUser)
    route.post('/byAdmin', controller.uploadByAdmin)
    route.post('/byUserPublic', controller.uploadByUserPublic)
    route.post('/byAdminPublic', controller.uploadByAdminPublic)
    return route
}