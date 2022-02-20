'use strict';

const e = require("express");
const { Op } = require("sequelize");
const Users = _model.users
const crypto = require('crypto');

function padIt(s) {
    s = "" + s;
    while (s.length < 3) {
        s = "0" + s;
    }
    return s;
}

const createID = (lastID, type) => {
    if (lastID && type) {
        let stringInc = "001";
        const datetime = moment().format('YYYYMMDDHHmm')
        let partsID = lastID[0][0].id.split("-");
        const partNumber = parseInt(partsID[2]);
        stringInc = lastID.length ? padIt(partNumber + 1) : stringInc
        return type + datetime + "-" + stringInc
    }
}

exports.createLastId = async (table, firstText) => {
    try {
        const lastID = await _db.query(`SELECT IFNULL(MAX(id),'') as id FROM ${table};`)
        if (lastID) {
            return createID(lastID, firstText)
        }
    } catch (err) {
        return err
    }
}

exports.checkToken = async (token, role_user_id) => {
    const roleUserId = role_user_id === "admin" ? "ROLE-USER-02" : role_user_id === "user" ? "ROLE-USER-01" : role_user_id === "legal" ? "ROLE-USER-03" : "ROLE-USER-01"
    const roleCheck = Array.isArray(role_user_id) ? [...role_user_id, "ROLE-USER-02"] : [roleUserId, "ROLE-USER-02"]
    try {
        const users = await Users.findOne({
            where: {
                [Op.and]: [
                    { user_token: token },
                    { role_user_id: { [Op.or]: roleCheck } },
                    { delete: 0 }
                ]
            }
        })
        return users.id ? [users] : []
    } catch (err) {
        return []
    }
}

var current_date = (new Date()).valueOf().toString();
var random = Math.random().toString();
exports.hashDirname = crypto.createHash('sha1').update(current_date + random).digest('hex');

exports.upload = async (req, pathName, callBack) => {
    if (req.files && Object.keys(req.files).length) {
        let sampleFile = req.files.file;
        const dirname = `../../public/upload/${pathName}/${hashDirname(pathName)}`
        sampleFile.mv(dirname, async function (err) {
            return callBack(err, dirname)
        });
    }
}