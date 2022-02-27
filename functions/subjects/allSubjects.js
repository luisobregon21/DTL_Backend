const { db } = require('../admin_init')

/* 
Method returns all Subjects and their attributes:
[
    {id: 1, subjectName: 'Programming'}
]
*/

exports.allSubjects = async (req, res) => {
    try {
        const usersSnapshot = await db.collection('Subjects').get()
        subjects = []
        usersSnapshot.docs.map((doc) => {
            subjects.push(doc.data())
        })
        return res.status(200).json(subjects)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
//users.push(doc.data())
