const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

/*
    req: { 
    "tutorId" : "C5TTEeuamuM9eXGX44Nq7bu8wm03",
    "review": 5
    } 
    
returns 
{
    "avg": 4.85,
    "reviewed": true,
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
        toUpdate.matches[index].scoreGiven = req.body.review

        try {
            db.doc(`users/${req.user.id}`).update(toUpdate)

            const userSnapshot = await db.doc(`users/${tutorId}`).get()
            const reviews = userSnapshot.data().tutorInfo.tutorReview
            const score =
                Math.round(
                    (reviews.reduce((a, b) => a + b) / reviews.length) * 100
                ) / 100
            reviews.push(req.body.review)

            db.doc(`users/${tutorId}`)
                .update(
                    'tutorInfo.tutorReview',
                    reviews,
                    'tutorInfo.score',
                    score,
                    'updatedAt',
                    Timestamp.now()
                )
                .then(() => {
                    res.status(200).json({
                        score,
                        reviewed: true,
                        scoreGiven: req.body.review,
                    })
                })
            // res.json({ zoom })
        } catch (err) {
            console.error(err)
            return res
                .status(500)
                .json({ error: 'Could not review this tutor' })
        }
    } else {
        return res
            .status(400)
            .json({ message: 'You have already reviewed this tutor' })
    }
}
