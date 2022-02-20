
const admin = require("firebase-admin");
const axios = require('axios')
const serviceAccount = require("../../core/bisaekspor-8ff80-d115115d4338.json");

axios.defaults.headers.common['Authorization'] = "key=" + process.env.FCMFIREBASE;

exports.firebaseFcm = async (data) => {
    axios.post('https://fcm.googleapis.com/fcm/send', data)
        .then(function (response) {
            console.log(response.statusText);
        })
        .catch(function (error) {
            console.log(error.statusText);
        });
}

exports.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});