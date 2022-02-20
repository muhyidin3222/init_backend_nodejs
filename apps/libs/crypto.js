const CryptoJS = require("crypto-js");

const PRIVATKEY = process.env.PRIVATKEY

exports.cryptoDecrypt = (encryptData) => {
    var bytes = CryptoJS.AES.decrypt(encryptData, PRIVATKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText)
}

exports.cryptoEncrypt = (encryptData) => {
    return CryptoJS.AES.encrypt(JSON.stringify(encryptData), PRIVATKEY).toString();
}