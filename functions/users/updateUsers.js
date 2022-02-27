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
    let userDetails = {}

    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio
    if (data.avatar) userDetails.avatar = data.avatar

    return userDetails
}

exports.updateUser = async (req, res) => {
    let userDetails = reduceDetails(req.body)

    db.doc(`users/${req.user.id}`)
        .update(userDetails)
        .then(() => {
            res.json({ message: 'user updated successfully' })
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}
