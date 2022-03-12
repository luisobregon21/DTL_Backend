// Firebase Functions
const functions = require('firebase-functions')

// users api's imports
const { newUser } = require('./users/newUser')
const { usersById } = require('./users/usersById')
const { usersLogin } = require('./users/usersLogin')
const { usersLogout } = require('./users/userLogOut')
const { allUsers } = require('./users/allUsers')
const { updateUser } = require('./users/updateUsers')
const { sendRequest } = require('./users/sendRequest')

// tutor api's imports
const { newTutor } = require('./tutors/newTutor')
const { updateTutor } = require('./tutors/updateTutor')
const { allTutors } = require('./tutors/allTutors')
const { tutorsById } = require('./tutors/tutorsById')
const { tutorsBySubject } = require('./tutors/tutorsBySubject')
const { denyRequest } = require('./tutors/denyRequest')
const { acceptRequest } = require('./tutors/acceptRequest')

// Middleware/protected route
const { withAuth } = require('./firebaseAuth')

// image uploaded and delete
const { imgUpload } = require('./users/imgUpload')
const { picUpload } = require('./tutors/picUpload')
const { deletePic } = require('./tutors/deletePic')

// Subjects api's imports
const { subjectById } = require('./subjects/subjectById')
const { allSubjects } = require('./subjects/allSubjects')

// Reviews
const { reviewTutor } = require('./reviews/reviewTutor')
const { reviewStudent } = require('./reviews/reviewStudent')

// Messages
const { allMatches } = require('./messages/allMatches')
const { sendMessage } = require('./messages/sendMessage')
const { allMessages } = require('./messages/allMessages')

// Initialize express and set up cors
const app = require('express')()

const cors = require('cors')
app.use(
    cors({
        origin: '*',
    })
)

// Users Post endpoints
app.post('/users/new', newUser)
app.post('/users/login', usersLogin)

// Users Get endpoints
app.get('/users/allUsers', allUsers)
app.get('/users/:id', usersById)

// Users PUT endpoint: only works with token
app.put('/users/edit-profile', withAuth, updateUser)
app.put('/users/image', withAuth, imgUpload)
app.put('/users/request', withAuth, sendRequest)

// User Get endpoints
app.get('/subjects/allSubjects', allSubjects)
app.get('/subjects/:id', subjectById)

// Messages GET endpoints
// get all users the user has matched with
app.get('/messages/allMatches', withAuth, allMatches)
// returns all the messages between two users
app.get('/messages/allMessages', allMessages)
// add message to database
app.post('/messages/sendMessage', withAuth, sendMessage)

//TUTORS GET endpoints
app.get('/tutors/allTutors', allTutors)
app.get('/tutors/:id', tutorsById)
app.get('/tutors/subject/:id', tutorsBySubject)

// Tutor POST endpoints
app.post('/tutors/new', newTutor)

// Tutor PUT endpoints: only works with token
app.put('/tutors/edit-profile', withAuth, updateTutor)
app.put('/tutors/image', withAuth, picUpload)
app.put('/tutors/acceptRequest', withAuth, acceptRequest)
app.put('/tutors/denyRequest', withAuth, denyRequest)
app.put('/tutors/reviewStudent', withAuth, reviewStudent)
app.put('/tutors/reviewTutor', withAuth, reviewTutor)
app.put('/users/logout', withAuth, usersLogout)

// Tutors Delete endpoints: only works with token
app.delete('/tutors/deleteImage', withAuth, deletePic)

// DTL's api by Luis Obregon and Guillermo Lorca
exports.api = functions.https.onRequest(app)
