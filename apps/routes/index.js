'use strict';

module.exports = () => {
    const router = require('express').Router();
    router.use('/auth', _router('auth')())
    router.use('/upload', _router('upload')())
   
    return router
}

function _router(name) {
    return require(`./${name}`)
}