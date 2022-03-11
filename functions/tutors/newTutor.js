const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')
const { createUserWithEmailAndPassword } = require('firebase/auth')
const { auth, firebaseConfig } = require('../app_init')
const { sendEmailVerification } = require('firebase/auth')
const { sendEmail } = require('../emails/welcomeEmail')

config = firebaseConfig

// function validates email
const isEmail = (email) => {
    const regEx =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (email.match(regEx)) return true
    else return false
}

exports.newTutor = async (req, res) => {
    const { username, email, password, confirmationPassword, subject } =
        req.body
    if (!username || !password || !email || !confirmationPassword || !subject) {
        return res.status(400).json({ message: 'Missing required field' })
    } else if (!isEmail(email)) {
        return res
            .status(400)
            .json({ message: 'Must be a valid email address' })
    }
    if (password !== confirmationPassword) {
        return res.status(400).json({ message: 'Passwords do not match' })
    }

    const noImg = 'no-profile.png'
    const noPic = 'no-picture.jpg'
    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', user.uid)
        //creating new tutor in tutors table that matches newly created user in firebase auth
        //POSSIBLE TODO add matches array to tutor
        const newTutor = {
            subjects: [subject],
            urls: [],
            imgs: [
                `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noPic}?alt=media`,
            ],
            requests: [],
            accepted: [],
            tutorReview: [3],
            score: null,
        }

        //creating new user in users table that matches newly created user in firebase auth
        const newUser = {
            id: user.uid,
            username,
            email,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            location: null,
            bio: null,
            avatar: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            tutorInfo: newTutor,
            matches: [],
            studentReview: [3],
            score: null,
        }

        await db.collection('users').doc(user.uid).set(newUser)
        const token = await user.getIdToken()
        sendEmailVerification(user)
        sendEmail(user.email)

        return res.status(201).json({
            ...newUser,
            createdAt: newUser.createdAt.toDate(),
            updatedAt: newUser.updatedAt.toDate(),
            token,
        })
    } catch (err) {
        console.log('Error creating new user:', err)
        return res.status(400).json({ message: err.message })
    }
}
