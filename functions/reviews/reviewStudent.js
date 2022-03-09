const { Timestamp } = require('firebase-admin/firestore')
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

exports.reviewStudent = async (req, res) => {
    const studentId = req.body.studentId
    const accepted = req.user.tutorInfo.accepted
    const index = accepted.findIndex(
        (accepted) => accepted['userId'] === studentId
    )

    if (!accepted[index].reviewed) {
        const toUpdate = {
            tutorInfo: req.user.tutorInfo,
            updatedAt: Timestamp.now(),
        }

        toUpdate.tutorInfo.accepted[index].reviewed = true

        try {
            db.doc(`users/${req.user.id}`).update(toUpdate)

            const userSnapshot = await db.doc(`users/${studentId}`).get()
            const reviews = userSnapshot.data().studentReview
            reviews.push(req.body.review)

            db.doc(`users/${studentId}`)
                .update('studentReview', reviews, 'updatedAt', Timestamp.now())
                .then(() => {
                    res.status(200).json({
                        avg:
                            Math.round(
                                (reviews.reduce((a, b) => a + b) /
                                    reviews.length) *
                                    100
                            ) / 100,
                    })
                })
            // res.json({ zoom })
        } catch (err) {
            console.error(err)
            return res
                .status(500)
                .json({ error: 'Could not review this Tutor' })
        }
    } else {
        return res
            .status(400)
            .json({ message: 'You have already reviewed this Tutor' })
    }
}
