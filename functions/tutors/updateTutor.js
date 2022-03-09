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

    let urls = []
    if (data.urls.length > 0) {
        try {
            for (let url of data.urls) {
                if (!isEmpty(url.trim())) {
                    // https://website.com
                    if (url.trim().substring(0, 4) !== 'http') {
                        urls.push(`http://${url.trim()}`)
                    } else urls.push(url)
                }
            }
        } catch (err) {
            console.error(err)
            return
        }
    }

    return urls
}

/*
method updates user. Example:
{
    "bio": "Hello, I am a tutor"

}
*/
exports.updateTutor = async (req, res) => {
    const urls = reduceDetails(req.body)
    let userDetails = {
        tutorInfo: req.user.tutorInfo,
    }

    if (urls.length !== 0) {
        userDetails.tutorInfo.urls = urls
        userDetails.updatedAt = Timestamp.now()
    }

    try {
        // console.log(db.doc(`tutors/${req.user.tutorId}`))
        db.doc(`users/${req.user.id}`)
            .update(userDetails)
            .then(() => {
                res.json({ urls: userDetails.tutorInfo.urls })
            })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}
