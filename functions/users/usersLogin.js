const { signInWithEmailAndPassword } = require('firebase/auth')
const { auth } = require('../app')

exports.usersLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            error: 'Need Both email and password',
        })
    }

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )

        console.log('user ', userCredential.user)

        const token = await userCredential.user.getIdToken()
        console.log(token)

        return res.status(200).json(userCredential.user)
    } catch (error) {
        console.error(error)
        return res.status(400).json({
            error: error.message,
        })
    }
}
