const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')
const { auth } = require('../app_init')

// checks for empty string
const isEmpty = (string) => {
    if (string.trim() === '') return true
    else return false
}

// Function to help uopdate userDetails
const reduceDetails = (data) => {
    // data is req.body
    let userDetails = {
        tutorInfo: {},
    }

    if (data.urls.length > 0) {
        userDetails.tutorInfo.urls = []
        try {
            for (let url of data.urls) {
                if (!isEmpty(url.trim())) {
                    // https://website.com
                    if (url.trim().substring(0, 4) !== 'http') {
                        userDetails.tutorInfo.urls.push(`http://${url.trim()}`)
                    } else userDetails.tutorInfo.urls.push(url)
                }
            }
        } catch (err) {
            console.error(err)
            return
        }
    }

    if (Object.keys(userDetails.tutorInfo).length > 0) {
        userDetails.updatedAt = Timestamp.now()
    }

    return userDetails
}

/*
method updates user. Example:
{
    "bio": "Hello, I am a tutor"

}
*/
exports.updateTutor = async (req, res) => {
    let userDetails = reduceDetails(req.body)
    try {
        // console.log(db.doc(`tutors/${req.user.tutorId}`))
        db.doc(`users/${req.user.id}`)
            .update(userDetails)
            .then(() => {
                res.json({ message: 'Tutor updated successfully' })
            })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}
