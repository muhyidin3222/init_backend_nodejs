'use strict';

module.exports = () => {
    const controller = _controller('user')
    const route = require('express').Router()
    route.get('/getAll', controller.getAll)
    route.post('/getAll', controller.getAllPost)
    route.post('/searchUser', controller.searchUser)
    
    route.post('/update', controller.update)
    route.post('/updateByAdmin', controller.updateByAdmin)
    route.delete('/delete/:id', controller.delete)
    route.get('/detail/:id', controller.detail)
    return route
}