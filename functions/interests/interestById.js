const { db } = require('../admin_init')
/* 
Method returns a object of the specified interest, example:
{
    "subjectName": "Programming",
    "img": "https://pbs.twimg.com/media/FJEQjL-XIAIqJSd.jpg",
    "id": 2
}
*/
exports.interestById = async (req, res) => {
    try {
        // userSnapshot has all of the info of how the content is saved
        const interestSnapshot = await db
            .collection('interests')
            .doc(req.params.id)
            .get()
        // content data by itself
        const interestData = interestSnapshot.data()
        return res.status(200).json({
            ...interestData,
        })
    } catch (err) {
        console.error(err)
        return res.status(404).json({
            message: 'Error Authenticating the Subject',
        })
    }
}
