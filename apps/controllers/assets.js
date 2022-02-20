"use strict"
var path = require('path');

exports.sendFile = (req, res, next, pathIcon) => {
    res.sendFile(path.join(__dirname + "../../assets" + pathIcon));
}