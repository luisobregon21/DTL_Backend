const { db } = require('../admin_init')

exports.allInterests = async (req, res) => {
    try {
        const usersSnapshot = await db.collection('interests').get()
        interests = {}
        usersSnapshot.docs.map((doc) => {
            interests[doc.data().subjectName + '.' + doc.data().id] = doc.data()
        })
        return res.status(200).json(interests)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
//users.push(doc.data())
