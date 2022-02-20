const fs = require("fs")
var pathFile = require('path')

exports.getAssets = async (req, res, next, urlPath) => {
    const path = __dirname + urlPath + req.path
    const pathSplit = path.split('.')
    const typePath = pathSplit[pathSplit.length - 1]
    if (typePath === "mp4") {
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1

            const chunksize = (end - start) + 1
            const file = fs.createReadStream(path, { start, end })
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head)
            file.pipe(res)
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(path).pipe(res)
        }
    } else {
        var options = {
            root: pathFile.join(__dirname + urlPath)
        };
        res.sendFile(req.path, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', req.path);
            }
        });
    }
}