const { db } = require('../admin_init')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')

/* 
endpoint recieves image url to be deleted:
{
    url: 'https://firebasestorage.googleapis.com/v0/b/dtl-mvp.appspot.com/o/no-picture.jpg?alt=media'
}

returns list of all the other images:
{
    [
        0: 'https://firebasestorage.googleapis.com/v0/b/dtl-mvp.appspot.com/o/no-picture.jpg?alt=media'
        1: 'https://firebasestorage.googleapis.com/v0/b/dtl-mvp.appspot.com/o/no-picture.jpg?alt=media'
    ]
}
*/

exports.deletePic = async (req, res) => {
    try {
        await db
            .doc(`/users/${req.user.id}`)
            .update('tutorInfo.imgs', FieldValue.arrayRemove(req.body.url))

        db.doc(`users/${req.user.id}`)
            .get()
            .then((data) => {
                return res.status(200).json({
                    imgs: data.data().tutorInfo.imgs,
                })
            })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Image could not be deleted' })
    }
}
