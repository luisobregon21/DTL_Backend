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

exports.acceptRequest = async (req, res) => {
    let tutor = {
        tutorId: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar,
        subjects: req.user.tutorInfo.subjects,
    }
    // console.log(tutor)

    const studentId = req.body.studentId
    const requests = req.user.tutorInfo.requests
    const index = requests.findIndex(
        (request) => request['userId'] === studentId
    )
    console.log(requests[index])
    try {
        db.doc(`users/${studentId}`).update(
            'matches',
            FieldValue.arrayUnion(tutor),
            'updatedAt',
            Timestamp.now()
        )

        db.doc(`users/${tutor.tutorId}`)
            .update(
                'tutorInfo.accepted',
                FieldValue.arrayUnion(requests[index]),
                'tutorInfo.requests',
                FieldValue.arrayRemove(requests[index]),
                'updatedAt',
                Timestamp.now()
            )
            .then(() => {
                res.json({ message: 'Match Made: tutor added successfully' })
            })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: 'Could not proceed with adding the tutor' })
    }
}
