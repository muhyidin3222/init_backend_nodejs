"use strict"

const Tugas = _model.upload_tugas
const Users = _model.users
const { checkToken } = _lib('general')
const { Op } = require("sequelize");
const { adminNotFound, userNotFound, successDelete, dataEmpty } = _lib('textResponse')

exports.get = (req, res, next) => bluebird.coroutine(function* () {
    const {
        token
    } = req.headers
    const {
        // idMateri,
        idUser
    } = req.body
    const users = yield checkToken(token, "user")
    if (users.length) {
        const tugas = yield Tugas.findAll({
            where: {
                [Op.and]: [
                    // { id_materi: idMateri },
                    { id_user: idUser }
                ]
            }
        })
        res.success(tugas)
    } else {
        res.notAccess(userNotFound)
    }
})().catch((err) => {
    console.log(err)
    res.error(err)
})

exports.create = (req, res, next) => bluebird.coroutine(function* () {
    const {
        id_materi,
        id_topik,
        answer1,
        answer2,
        attachment,
        next_materi_id,
        next_topik_id
    } = req.body
    const {
        token
    } = req.headers
    const users = yield checkToken(token, "user")
    if (users.length) {
        const tugas = yield Tugas.create({
            id_user: users[0].id,
            // id_materi,
            id_topik,
            answer1,
            answer2,
            attachment
        });

        yield Users.update({
            materi_id: id_materi,
            topik_id: id_topik,
            next_materi_id: next_materi_id,
            next_topik_id: next_topik_id
        }, {
            where: { user_token: token }
        });

        res.success(tugas)
    } else {
        res.notAccess(userNotFound)
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
    const users = yield checkToken(token, "admin")
    if (users.length) {
        const tugas = yield Tugas.destroy({
            where: {
                id
            }
        });
        if (!tugas) {
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