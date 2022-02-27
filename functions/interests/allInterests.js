const { db } = require('../admin_init')

/* 
Method returns all interests and their attributes:
{ 
    "Salsa.1":{
        "subjectName": "Salsa",
        "img": "",
        "id": 1
    }
}
*/

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
