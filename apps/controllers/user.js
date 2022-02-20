"use strict"
const Users = _model.users
const PaymentOrder = _model.payment_orders
const Corporates = _model.corporates
const KbliData = _model.kbli_data

const { checkToken } = _lib('general')
const { adminNotFound, userNotFound, errorUser, successDelete, dataEmpty } = _lib('textResponse')
const { Op } = require("sequelize");
const getDataPayment = [
    {
        model: PaymentOrder,
        as: 'paymentTipsData',
        attributes: [
            "transaction_status",
        ]
    },
    {
        model: Corporates,
        as: 'corporatesData',
        include: [
            {
                model: PaymentOrder,
                as: 'paymentData'
                // attributes: ["transaction_status"]
            }
        ]
        // attributes: [
        //     "transaction_status",
        // ]
    },
]

exports.update = async (req, res, next) => {
    let transaction
    const {
        token
    } = req.headers
    const checkId = await checkToken(token, "user")
    try {
        if (checkId.length) {
            transaction = await _model.sequelize.transaction()
            await Users.update(req.body, {
                where: { user_token: token }
            });
            await transaction.commit()
            res.success(req.body)
        } else {
            res.notAccess(userNotFound)
        }
    } catch (err) {
        await transaction.rollback()
        res.error(errorUser)
    }
}

exports.updateByAdmin = async (req, res, next) => {
    const {
        username,
        mobile_number,
        payment,
        payment_date,
        id,
        // materi_id,
        // topik_id,
    } = req.body
    const {
        token
    } = req.headers
    const checkId = await checkToken(token, "admin")
    try {
        if (checkId.length) {
            // transaction = await _model.sequelize.transaction()
            const response = await Users.update(req.body, {
                where: { id }
            });
            console.log(response)
            // await transaction.commit()
            res.success(req.body)
        } else {
            res.notAccess(userNotFound)
        }
    } catch (err) {
        console.log(err)
        // await transaction.rollback()
        res.error(errorUser)
    }
}

exports.getAll = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const {
        page,
        total_items
    } = req.query
    const totalItems = total_items ? Number(total_items) : 10
    const offset = Number(page) * totalItems - totalItems
    const checkId = yield checkToken(token, "admin")
    if (checkId.length) {
        const users = yield Users.findAndCountAll({
            limit: totalItems,
            offset: offset,
            where: { delete: 0 },
            include: getDataPayment,
            attributes: [
                "id",
                "email",
                "username",
                "mobile_number",
                "payment",
                "payment_course",
                "type_payment_tips",
                "payment_tips",
                "payment_date",
                "materi_id",
                "topik_id",
                "about",
                "interest",
                "photo",
                "role_auth_id",
                "role_user_id",
                "level_user",
                "next_materi_id",
                "next_topik_id",
            ]

        })
        res.success(users)
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.getAllPost = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const {
        offset,
        limit
    } = req.body
    const checkId = yield checkToken(token, "admin")
    if (checkId.length) {
        const users = yield Users.findAndCountAll({
            where: { delete: 0 },
            offset,
            limit
        })
        res.success(users)
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.detail = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const {
        id
    } = req.params
    const checkId = yield checkToken(token, "user")
    if (checkId.length) {
        const users = yield Users.findAll({
            where: { id },
            include: getDataPayment
        })
        res.success(users[0])
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.delete = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const {
        id
    } = req.params
    const checkId = yield checkToken(token, "admin")
    if (checkId.length) {
        const user = yield Users.update({
            delete: 1,
            mobile_number: null,
            payment: null,
            payment_course: null,
            type_payment_tips: null,
            payment_tips: null,
            payment_date: null,
            materi_id: null,
            topik_id: null,
            next_materi_id: null,
            next_topik_id: null,
            about: null,
            interest: null,
            photo: null,
            id_fb: null,
            fcmToken: null
        }, {
            where: { id }
        });
        if (user[0] === 0) {
            res.notfound(dataEmpty)
        } else {
            res.success(successDelete + "  " + id)
        }
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})


exports.searchUser = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const {
        text
    } = req.body
    const {
        page,
        total_items
    } = req.query
    const totalItems = total_items ? Number(total_items) : 10
    const offset = Number(page) * totalItems - totalItems
    const checkId = yield checkToken(token, "admin")
    if (checkId.length) {
        const users = yield Users.findAndCountAll({
            limit: totalItems,
            offset: offset,
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: `${text}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `${text}%`
                        }
                    }
                ]
            },
            include: getDataPayment
        })
        res.success(users)
    } else {
        res.notAccess(adminNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})
