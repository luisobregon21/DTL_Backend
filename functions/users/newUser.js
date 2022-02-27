const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')
const { createUserWithEmailAndPassword } = require('firebase/auth')
const { auth } = require('../app_init')

exports.newUser = async (req, res) => {
    const { username, email, password, confirmationPassword } = req.body
    if (!username || !password || !email || !confirmationPassword) {
        return res.status(400).json({ message: 'Missing required field' })
    }

    if (password !== confirmationPassword) {
        return res.status(400).json({ message: 'Passwords do not match' })
    }

    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', user.uid)
        //creating new user in users table that matches newly created user in firebase auth
        const newUser = {
            id: user.uid,
            username,
            email,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            location: null,
            bio: null,
            avatar: null,
            tutorId: null,
        }

        await db.collection('users').doc(user.uid).set(newUser)
        const token = await user.getIdToken()

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
