const multer = require('multer');

// ? recomendable para almacenar en memoria o en la nube.
const storage = multer.memoryStorage()

const upload = multer({ storage })

module.exports = {
    upload
}