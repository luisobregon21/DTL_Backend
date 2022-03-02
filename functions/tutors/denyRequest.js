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
                res.json({
                    message: 'Request Decline: Request removed successfully',
                })
            })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: 'Could not proceed with removing the request' })
    }
}
