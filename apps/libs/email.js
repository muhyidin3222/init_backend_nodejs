const nodemailer = require('nodemailer');
const { USER_PASSWORD, USER_EMAIL } = process.env

var auth = {
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD
    }
}

let transporter = nodemailer.createTransport(auth, function (err, info) {
    if (err) {
        console.log(err, "'ERRORR SEND EMAIL TO CLIENT!'");
    } else {
        console.log(info, 'SUCCESS SEND EMAIL TO CLIENT!')
    }
});

exports.sendEmail = async (configEmail) => transporter.sendMail(configEmail)