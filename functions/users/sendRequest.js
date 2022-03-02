const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

/*
    req: { 
        user: userId, 
        Tutor: TutorId
    } */

/*
method updates Pending to Tutor. Example:
{
    "pending": [{id: 1, username: "", avatar: ""}]
}
*/

exports.sendRequest = async (req, res) => {
    let user = {
        userId: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar,
    }

    try {
        db.doc(`users/${req.body.tutorId}`)
            .update(
                'tutorInfo.requests',
                FieldValue.arrayUnion(user),
                'updatedAt',
                Timestamp.now()
            )
            .then(() => {
                res.json({ message: 'User updated successfully' })
            })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: 'Could not proceed to send request' })
    }
}
