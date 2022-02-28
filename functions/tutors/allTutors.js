const { db } = require('../admin_init')

exports.allTutors = async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get()
        const TutorsSnapshot = await db.collection('tutors').get()
        tutorInfo = {}
        users = {}
        usersSnapshot.docs.map((doc) => {
            if (doc.data().tutorId) {
                users[doc.data().username + '.' + doc.data().tutorId] = [
                    doc.data(),
                ]
            }
        })
        usersSnapshot.docs.map((doc) => {
            tutorInfo[doc.data().id] = doc.data()
        })
        for (key in users) {
            for (id in tutorInfo) {
                if (key.includes(id)) {
                    users[key].push[tutorInfo[id]]
                }
            }
        }
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
//users.push(doc.data())
