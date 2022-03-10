const { db, admin } = require('../admin_init')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const { firebaseConfig } = require('../app_init')
config = firebaseConfig

// busBoy allows images to be uploaded
exports.picUpload = async (req, res) => {
    // default packages
    const busboyCons = require('busboy')
    const path = require('path')
    const os = require('os')
    const fileSystem = require('fs')

    const bb = busboyCons({ headers: req.headers })

    let imageFileName
    let imageTobeUploaded = {}

    // on file events, file is the name for file Upload
    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
        // note: only filename and mimetype will be used, but need the other arguements so that mimetype has the right value

        // img.png or img.jpg => png or jpg
        // my.image.png => ['my', 'image', 'png']

        console.log(filename.filename)
        let imageExtension = filename.filename.split('.')
        imageExtension = imageExtension.slice(-1)[0]
        console.log(imageExtension)

        // randmom value, example: 47284234284.png
        imageFileName = `${Math.round(
            Math.random() * 100000000000
        )}.${imageExtension}`

        // filepath
        const filepath = path.join(os.tmpdir(), imageFileName)
        imageTobeUploaded = { filepath, mimetype }

        // create the file
        file.pipe(fileSystem.createWriteStream(filepath))
    })
    bb.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageTobeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageTobeUploaded.mimetype,
                        //Generate token to be appended to imageUrl
                        //firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
            .then(() => {
                // alt=mediashows image on the browser
                const image = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`

                const noImg =
                    'https://firebasestorage.googleapis.com/v0/b/dtl-mvp.appspot.com/o/no-picture.jpg?alt=media'

                db.doc(`/users/${req.user.id}`).update(
                    'tutorInfo.imgs',
                    FieldValue.arrayRemove(noImg)
                )

                return db
                    .doc(`/users/${req.user.id}`)
                    .update(
                        'tutorInfo.imgs',
                        FieldValue.arrayUnion(image),
                        'updatedAt',
                        Timestamp.now()
                    )
            })
            .then(() => {
                db.doc(`users/${req.user.id}`)
                    .get()
                    .then((data) => {
                        return res.status(200).json({
                            imgs: data.data().tutorInfo.imgs,
                        })
                    })
            })
            .catch((err) => {
                console.error(err)
                return res.status(500).json({ error: err.code })
            })
    })
    bb.end(req.rawBody)
}
