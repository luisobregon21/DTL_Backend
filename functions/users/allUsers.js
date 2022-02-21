const { db } = require('../admin_init')

exports.allUsers = async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get()
        users = {}
        usersSnapshot.docs.map((doc) => {
            users[doc.data().username + '.' + doc.data().id] = doc.data()
        })
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
//users.push(doc.data())
