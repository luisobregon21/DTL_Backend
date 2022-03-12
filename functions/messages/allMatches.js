const { db } = require('../admin_init')

exports.allMatches = async (req, res) => {
    try {
        const usersSnapshot = await db.doc(`users/${req.user.id}`).get()
        const currentUser = usersSnapshot.data()
        const users = []

        currentUser.matches.map((user) => {
            const toAdd = {
                id: user.tutorId,
                avatar: user.avatar,
                username: user.username,
                isOnline: user.isOnline,
            }
            const isFound = users.some((element) => {
                if (element.id === toAdd.id) {
                    return true
                }
            })
            if (!isFound) users.push(toAdd)
        })
        if (currentUser.tutorInfo) {
            currentUser.tutorInfo.accepted.map((user) => {
                const toAdd = {
                    id: user.userId,
                    avatar: user.avatar,
                    username: user.username,
                    isOnline: user.isOnline,
                }
                const isFound = users.some((element) => {
                    if (element.id === toAdd.id) {
                        return true
                    }
                })
                if (!isFound) users.push(toAdd)
            })
        }
        return res.status(200).json(users)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Could not find any matches' })
    }
}
