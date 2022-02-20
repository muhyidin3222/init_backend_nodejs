'use strict';

require('dotenv').config();

// Global START
global.ENV = process.env.NODE_ENV || `development`
global.Sequelize = require(`sequelize`)
global.bluebird = require(`bluebird`)
global._db = require(`${__dirname}/core/db`).getConnection()
global._controller = require(`${__dirname}/apps/controllers`)
global._lib = require(`${__dirname}/apps/libs`)
global._model = require(`${__dirname}/database/models`)
global._modelApi = require(`${__dirname}/apps/models`)
global.moment = require(`moment`)
global._LOG_FOLDER = `${__dirname}/logs`

var path = require('path')
global.appRoot = path.resolve(__dirname);
// Global END

//Requires START
const express = require('express');
const response = require('./core/response.js')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const router = require(`${__dirname}/apps/routes`)()
const fileUpload = require('express-fileupload')
const fs = require("fs")

//Requires END

//Init app start
const app = express();

app.set('x-powered-by', false);
app.set('trust proxy', true);

app.use(response)
app.use(cors({
    credentials: true,
    origin: true
}))
app.use(bodyParser.json({
    'strict': false,
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 1000000
}))
// app.use('/public', express.static('public'))

app.use(morgan('dev'))
app.use(fileUpload({
    createParentPath: true
}))
app.use(router)


app.get('/', (req, res) => {
    res.send("success")
})

app.listen(process.env.PORT || 8080, '0.0.0.0', function () {
    console.log("SERVER BERJALAN DI PORT " + process.env.PORT)
})

module.exports = app