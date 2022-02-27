const { db } = require('../admin_init')
/* 
Method returns a object of the specified subject, example:
{
    "subjectName": "Programming",
    "img": "https://pbs.twimg.com/media/FJEQjL-XIAIqJSd.jpg",
    "id": 2
}
*/
exports.subjectById = async (req, res) => {
    try {
        // userSnapshot has all of the info of how the content is saved
        const subjectSnapshot = await db
            .collection('Subjects')
            .doc(req.params.id)
            .get()
        // content data by itself
        const subjectData = subjectSnapshot.data()
        return res.status(200).json({
            ...subjectData,
        })
    } catch (err) {
        console.error(err)
        return res.status(404).json({
            message: 'Error Authenticating the Subject',
        })
    }
}
