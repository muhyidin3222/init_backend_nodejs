"use strict"
const moment = require('moment');
const crypto = require('crypto');
const CryptoJS = require("crypto-js");

const Users = _model.users
const Auths = _model.auths
const Configs = _model.configs
const PaymentOrder = _model.payment_orders
const { createLastId } = _lib('general')
const { Op } = require("sequelize");
const { base64decode } = _lib('auth')
const { invalidSignature } = _lib('textResponse')
const { cryptoDecrypt, cryptoEncrypt } = _lib('crypto')
const APIKEY = process.env.APIKEY
const PRIVATKEY = process.env.PRIVATKEY

const checkTime = (param) => {
    return moment(new Date()).isAfter(param)
}

exports.post = (req, res, next) => bluebird.coroutine(function* () {
    const {
        email,
        username,
        role_auth_id,
        role_user_id,
        user_token,
        fcmToken
    } = req.body
    const {
        signature_app
    } = req.headers
    if (APIKEY == signature_app || true) {
        const idUser = yield createLastId('users', `USER-`)
        const [user, created] = yield Users.findOrCreate({
            where: {
                [Op.and]: [
                    { email },
                    { role_auth_id },
                    { role_user_id }
                ]
            },
            defaults: {
                fcmToken,
                id: idUser,
                email,
                username,
                role_auth_id,
                role_user_id,
                user_token,
                delete: 0,
            }
        });

        const version_app = yield Configs.findAll({
            where: {
                [Op.or]: [
                    { name: "version_app" },
                    { name: "whatt_app" }
                ]
            },
            attributes: ['value', "name"]
        })
        if (created) {
            yield Auths.create({
                email,
                role_auth_id
            })
            res.success(user)
        } else {
            yield Auths.update(
                {
                    lasts_login: new Date()
                },
                {
                    where: {
                        email,
                        role_auth_id
                    }
                }
            )
            yield Users.update(
                {
                    user_token,
                    fcmToken,
                    delete: 0
                },
                {
                    where: {
                        [Op.and]: [
                            { email },
                            { role_auth_id },
                            { role_user_id }
                        ]
                    }
                }
            )
            let paymentOrder = []
            let paymentTips = []

            const payment_course = user.dataValues.payment_course
            const payment_tips = user.dataValues.payment_tips

            if (payment_course)
                paymentOrder = yield PaymentOrder.findAll({
                    where: {
                        id: payment_course,
                        transaction_status: "pending"
                    }
                })

            if (payment_tips)
                paymentTips = yield PaymentOrder.findAll({
                    where: {
                        id: payment_tips,
                        transaction_status: "pending"
                    }
                })

            if (paymentOrder[0] && paymentOrder[0].bank === "bca" && checkTime(paymentOrder[0].transaction_time)) {
                const successPayment = yield PaymentOrder.update({
                    transaction_status: "expire",
                }, {
                    where: {
                        id: paymentOrder[0].id,
                        transaction_status: "pading"
                    }
                });
                if (successPayment.length) {
                    Users.update({
                        payment_course: null
                    }, {
                        where: {
                            [Op.and]: [
                                { email },
                                { role_auth_id },
                                { role_user_id }
                            ]
                        }
                    })
                    paymentOrder = []
                }
            }


            if (paymentTips[0] && paymentTips[0].bank === "bca" && checkTime(paymentTips[0].transaction_time)) {
                const successPayment = yield PaymentOrder.update({
                    transaction_status: "expire",
                }, {
                    where: {
                        id: paymentTips[0].id,
                        transaction_status: "pading"
                    }
                });
                if (successPayment.length) {
                    yield Users.update({
                        type_payment_tips: null,
                        payment_tips: null
                    }, {
                        where: {
                            [Op.and]: [
                                { email },
                                { role_auth_id },
                                { role_user_id }
                            ]
                        }
                    })
                    paymentTips = []
                }
            }
            user.user_token = user_token
            res.success({ ...user.dataValues, paymentOrder: paymentOrder[0], paymentTips: paymentTips[0], config: version_app })
        }
    } else {
        res.notAccess(invalidSignature)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.loginByAdmin = (req, res, next) => bluebird.coroutine(function* () {
    const {
        // email,
        // password,
        encryptData
    } = req.body
    const { email, password } = cryptoDecrypt(encryptData)
    console.log(email, password)
    const users = yield Users.findAll({
        where: {
            [Op.and]: [
                { email },
                { user_token: Buffer.from(password).toString('base64') },
                { role_user_id: { [Op.or]: ["ROLE-USER-02", "ROLE-USER-03"] } },
                { delete: 0 }
            ]
        },
        attributes: ["id", "user_token", "role_user_id"]
    })
    console.log(users)
    if (users.length) {
        res.success({ encryptData: cryptoEncrypt(users[0]) })
    } else {
        res.error("password salah")
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})


exports.logOut = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const users = yield Users.update({
        fcmToken: null,
        user_token: null
    }, {
        where: {
            user_token: token
        }
    })
    res.success(users[0])
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.fbDeleteAccount = (req, res, next) => bluebird.coroutine(function* () {
    console.log(req.body)
    function parseSignedRequest(signed_request, secret) {
        var encoded_data = signed_request.split('.', 2);
        // decode the data
        var sig = encoded_data[0];
        var json = base64decode(encoded_data[1]);
        var data = JSON.parse(json);
        if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
            throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
        }
        var expected_sig = crypto.createHmac('sha256', secret).update(encoded_data[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
        if (sig !== expected_sig) {
            throw Error('Invalid signature: ' + sig + '. Expected ' + expected_sig);
        }
        return data;
    }
    const data = yield parseSignedRequest(req.body.signed_request || req.body, process.env.KEY_FB)
    const { email } = data
    if (data && email) {
        yield Users.update({
            delete: 1
        }, {
            where: { email: email }
        });
    }
    res.success(data)
})().catch((err) => {
    console.log(err)
    res.error(err)
})