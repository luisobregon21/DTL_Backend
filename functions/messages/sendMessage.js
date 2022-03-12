const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')

/*
    endpoint recieves:
    {
        user2: id,
        text: "Text message being sent"
    }

    returns the chat sent: 
    {
        from: "pepe"
        to: "Juan"
        text: "Hola Juan"
        media: "img/null"
    }
*/
exports.sendMessage = async (req, res) => {
    const user1 = req.user.id
    const user2 = req.body.user2
    // id for the doc that will hold the chat collection
    // example: 9LYBoPrOKQgGBeyorWiyvoCfveF28hq2OdbZc5gITHBTieEUIBDRdRJ3
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    console.log(id)
    try {
        const user2Name = (await db.doc(`users/${user2}`).get()).data().username
        //const user2Name = data.data().username
        console.log(user2Name)

        const newChat = {
            from: req.user.username,
            to: user2Name,
            text: req.body.text,
            media: null,
            createdAt: Timestamp.now(),
        }

        db.collection('messages').doc(id).collection('chat').add(newChat)
        return res.status(201).json({ ...newChat })
    } catch (err) {
        console.log('Could not add message')
        return res.status(404).json({ message: err.message })
    }
}
