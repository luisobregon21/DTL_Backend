const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

exports.allMessages = async (req, res) => {
    // make it a withAuth
    try {
        const user1 = req.user.id
        const user2 = req.body.user2
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

        const chatSnap = await db
            .collection('messages')
            .doc(id)
            .collection('chat')
            .get()

        // return by most recent
        const messages = chatSnap.docs.map((doc) => {
            return doc.data()
        })
        return res.status(200).json(messages)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Could not get all the messages' })
    }
}
