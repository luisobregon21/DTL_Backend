const { db } = require('../admin_init')

exports.allTutors = async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get()
        const users = {}
        usersSnapshot.docs.map((doc) => {
            if (doc.data().tutorInfo) {
                users[doc.data().username + '.' + doc.data().id] = doc.data()
            }
        })
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
