const { db } = require('../admin_init')

exports.allMatches = async (req, res) => {
    try {
        const usersSnapshot = await db.doc(`users/${req.user.id}`).get()
        const currentUser = usersSnapshot.data()
        const users1 = []
        const users2 = []

        currentUser.matches.map((user) => {
            users1.push(user.tutorId)
        })
        if (currentUser.tutorInfo) {
            currentUser.tutorInfo.accepted.map((user) => {
                users2.push(user.userId)
            })
        }
        const joined = users1.concat(users2)
        const users = [...new Set(joined)]
        console.log(users)

        const allSnapshot = await db.collection('users').get()
        const myUsers = []
        allSnapshot.docs.map((doc) => {
            if (users.includes(doc.data().id)) {
                const toAdd = {
                    id: doc.data().id,
                    avatar: doc.data().avatar,
                    username: doc.data().username,
                    isOnline: doc.data().isOnline,
                }
                myUsers.push(toAdd)
            }
        })
        return res.status(200).json(myUsers)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Could not find any matches' })
    }
}
