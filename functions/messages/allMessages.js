const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

exports.allMessages = async (req, res) => {
    // make it a withAuth
    try {
        const chatSnap = await db
            .collection('messages')
            .doc(req.body.id)
            .collection('chat')
            .get()

        messages = []
        // return by most recent
        const test = chatSnap.docs.orderBy('createdAt')
        // chatSnap.docs.map((doc) => {
        //     messages.push(doc.data())
        // })
        return res.status(200).json(test)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Could not get all the messages' })
    }
}
