const { db } = require('../admin_init')
const { firebaseConfig } = require('../app_init')
config = firebaseConfig

// busBoy allows images to be uploaded
exports.imgUpload = async (req, res) => {
    // default packages
    const path = require('path')
    const os = require('os')
    const fileSystem = require('fs')

    const Busboy = require('busboy')
    const busboy = new Busboy({ headers: req.headers })

    let imageFileName
    let imageTobeUploaded = {}

    // on file events, file is the name for file Upload
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        // note: only filename and mimetype will be used, but need the other arguements so that mimetype has the right value

        console.log(fieldname)
        console.log(filename)
        console.log(mimetype)
        // img.png or img.jpg => png or jpg
        const imageExtension =
            filename.split('.')[filename.split('.').length - 1]

        // randmom value, example: 47284234284.png
        imageFileName = `${Math.round(
            Math.random() * 100000000000
        )}.${imageExtension}`

        // filepath
        const filePath = path.join(os.tmpdir(), imageFileName)
        imageTobeUploaded = { filePath, mimetype }

        // create the file
        file.pipe(fileSystem.createReadStream(filePath))
    })
    busboy.on('finish', () => {
        db.bucket()
            .upload(imageTobeUploaded.filePath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageTobeUploaded.mimetype,
                    },
                },
            })
            .then(() => {
                // alt=mediashows image on the browser
                const avatar = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`

                return db.doc(`/users/${req.user.id}`).update({ avatar })
            })
            .then(() => {
                return res.json({ message: 'Image Uploaded Successfully' })
            })
            .catch((err) => {
                console.error(err)
                return res.status(500).json({ error: err.code })
            })
    })
}
