const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

/*
    req: { 
        user: userId, 
        Tutor: TutorId
    } 
    
method updates Pending to Tutor. Example:
{
    "pending": [{id: 1, username: "", avatar: ""}]
}
*/

exports.denyRequest = async (req, res) => {
    const studentId = req.body.studentId
    const requests = req.user.tutorInfo.requests
    const index = requests.findIndex(
        (request) => request['userId'] === studentId
    )
    console.log(requests[index])
    try {
        db.doc(`users/${req.user.id}`)
            .update(
                'tutorInfo.requests',
                FieldValue.arrayRemove(requests[index]),
                'updatedAt',
                Timestamp.now()
            )
            .then(() => {
                db.doc(`users/${req.user.id}`)
                    .get()
                    .then((data) => {
                        res.status(200).json({
                            requests: data.data().tutorInfo.requests,
                        })
                    })
            })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: 'Could not proceed with removing the request' })
    }
}
