"use strict"

const { getAssets } = _lib('assetsConfig')

exports.get = async (req, res, next) => {
    // // const { authorization } = req.query
    // // const checkId = await checkToken(authorization, "user")
    // var options = {
    //     root: path.join(__dirname + "/../../private")
    // };
    // // if (checkId.length) {
    // res.sendFile(req.path, options, function (err) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         console.log('Sent:', req.path);
    //     }
    // });
    // // } else {
    // //     res.notAccess(userNotFound)
    // // }

    const urlPath = "/../../private"
    await getAssets(req, res, next, urlPath)
}

exports.publicAssets = async (req, res, next) => {
    const urlPath = "/../../public"
    await getAssets(req, res, next, urlPath)
}