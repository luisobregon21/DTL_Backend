const { db } = require('../admin_init')

exports.tutorsBySubject = async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get()
        const users = []
        usersSnapshot.docs.map((doc) => {
            if (
                doc.data().tutorInfo &&
                parseInt(req.params.id) === doc.data().tutorInfo.subjects[0]
            ) {
                users.push(doc.data())
            }
        })
        return res.status(200).json(users)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Could not find any matches' })
    }
}
