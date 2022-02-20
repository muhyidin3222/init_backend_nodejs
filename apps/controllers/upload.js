"use strict"

const { checkToken } = _lib('general')
const moment = require("moment");
const { successUpload, errorUpload, adminNotFound } = _lib('textResponse')
var fs = require('fs');

const uploadAdmin = (req, res, path) => {
    const {
        path_old
    } = req.body
    const dateFormat = moment().format("YYYYMMDDHHmmss")
    if (req.files || Object.keys(req.files).length) {
        let sampleFile = req.files.file;
        const leftName = sampleFile.name.split(".")
        const type = leftName[leftName.length - 1]
        const dirname = `${__dirname}/../../${path}/upload/admin/${dateFormat}.${type}`
        sampleFile.mv(dirname, async function (err) {
            if (err)
                return res.error(errorUpload)
            res.success({
                path: `/${path}/upload/admin/${dateFormat}.${type}`,
                message: successUpload
            });
            if (path_old)
                fs.unlinkSync(`${__dirname}/../..${path_old}`);
        });
    }
}

const uploadUser = (req, res, users, path) => {
    const {
        path_old
    } = req.body
    const dateFormat = moment().format("YYYYMMDDHHmmss")
    if (req.files || Object.keys(req.files).length) {
        let sampleFile = req.files.file;
        const leftName = sampleFile.name.split(".")
        const type = leftName[leftName.length - 1]
        const dirname = `${__dirname}/../../${path}/upload/user/${users[0].id}/${dateFormat}.${type}`
        sampleFile.mv(dirname, async function (err) {
            if (err)
                return res.error(errorUpload)
            res.success({
                path: `/${path}/upload/user/${users[0].id}/${dateFormat}.${type}`,
                message: successUpload
            });
            if (path_old)
                fs.unlinkSync(`${__dirname}/../..${path_old}`);
        });
    }
}

exports.uploadByAdmin = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const users = yield checkToken(token, "admin")
    if (users.length) {
        uploadAdmin(req, res, "private")
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.uploadByUser = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const users = yield checkToken(token, "user")
    if (users.length) {
        uploadUser(req, res, users, "private")
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.uploadByAdminPublic = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const users = yield checkToken(token, "admin")
    if (users.length) {
        uploadAdmin(req, res, "public")
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.uploadByUserPublic = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const users = yield checkToken(token, "user")
    if (users.length) {
        uploadUser(req, res, users, "public")
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})