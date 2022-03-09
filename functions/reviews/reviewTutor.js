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

exports.reviewTutor = async (req, res) => {
    const tutorId = req.body.tutorId
    const matches = req.user.matches
    const index = matches.findIndex((match) => match['tutorId'] === tutorId)

    if (!matches[index].reviewed) {
        const toUpdate = {
            matches,
            updatedAt: Timestamp.now(),
        }
        toUpdate.matches[index].reviewed = true

        try {
            db.doc(`users/${req.user.id}`).update(toUpdate)

            const userSnapshot = await db.doc(`users/${tutorId}`).get()
            const reviews = userSnapshot.data().tutorInfo.tutorReview
            reviews.push(req.body.review)

            db.doc(`users/${tutorId}`)
                .update(
                    'tutorInfo.tutorReview',
                    reviews,
                    'updatedAt',
                    Timestamp.now()
                )
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
                .json({ error: 'Could not review this student' })
        }
    } else {
        return res
            .status(400)
            .json({ message: 'You have already reviewed this student' })
    }
}