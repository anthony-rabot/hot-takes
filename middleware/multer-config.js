const multer = require('multer')

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
}

// https://www.npmjs.com/package/multer doc with values of file

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, callback) => {
        const cleanName = file.originalname.split(' ').join('_')
        const nameWithoutExtension = cleanName.split('.')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, nameWithoutExtension[0] + Date.now() + '.' + extension)
    }
})

module.exports = multer({storage: storage}).single('image')