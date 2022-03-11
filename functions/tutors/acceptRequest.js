const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const { db } = require('../admin_init')
const { sendMatchEmail } = require('../emails/matchEmail')
const { newMeeting } = require('../zoomMeeting')

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
        reviewed: false,
        scoreGiven: null,
    }
    // console.log(tutor)

    //Generating new zoom meeting
    const zoom = await newMeeting()
    const zoomCredentials = {
        url: zoom.join_url,
        passcode: zoom.password,
    }
    console.log(zoomCredentials)

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

        const studentSnap = await db.doc(`users/${studentId}`).get()
        // console.log(studentSnap.data())
        sendMatchEmail(
            req.user.email,
            tutor.username,
            studentSnap.data().username,
            zoomCredentials,
            studentSnap.data().email
        )
        sendMatchEmail(
            studentSnap.data().email,
            studentSnap.data().username,
            tutor.username,
            zoomCredentials,
            req.user.email
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
                db.doc(`users/${tutor.tutorId}`)
                    .get()
                    .then((data) => {
                        res.status(200).json({
                            accepted: data.data().tutorInfo.accepted,
                            requests: data.data().tutorInfo.requests,
                        })
                    })
            })
        // res.json({ zoom })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: 'Could not proceed with the Match' })
    }
}
