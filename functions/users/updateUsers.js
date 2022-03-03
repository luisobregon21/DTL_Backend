const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

// checks for empty string
const isEmpty = (string) => {
    if (string.trim() === '') return true
    else return false
}

// Function to help uopdate userDetails
const reduceDetails = (data) => {
    // data is req.body
    let userDetails = {}
    if (data.bio.length > 300) {
        return null
    }

    if (data.bio !== null && data.bio !== undefined) {
        if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio
        else userDetails.bio = null
    }

    if (data.location !== null && data.location !== undefined) {
        if (!isEmpty(data.location.trim())) userDetails.location = data.location
        else userDetails.location = null
    }

    if (Object.keys(userDetails).length > 0) {
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
exports.updateUser = async (req, res) => {
    let userDetails = reduceDetails(req.body)

    if (!userDetails.bio) {
        userDetails.bio = req.user.bio
    }
    if (!userDetails.location) {
        userDetails.bio = req.user.location
    }

    console.log(req.user.id)
    if (userDetails === null) {
        return res.status(400).json({ message: 'bio description is too long' })
    }

    try {
        db.doc(`users/${req.user.id}`)
            .update(userDetails)
            .then(() => {
                user = req.user
                return res.status(200).json({
                    ...user,
                    bio: userDetails.bio,
                    location: userDetails.location,
                })
            })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.code })
    }
}
