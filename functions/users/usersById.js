const { db } = require('../admin_init')

exports.usersById = async (req, res) => {
    try {
        // userSnapshot has all of the info of how the content is saved
        const userSnapshot = await db
            .collection('users')
            .doc(req.params.id)
            .get()
        // content data by itself
        const userData = userSnapshot.data()
        return res.status(200).json({
            ...userData,
            createdAt: userData.createdAt.toDate(),
            updatedAt: userData.updatedAt.toDate(),
        })
    } catch (err) {
        console.error(err)
        return res.status(404).json({
            message: 'Error Authenticating the User',
        })
    }
}
