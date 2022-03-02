// Firebase Functions
const functions = require('firebase-functions')

// users api's imports
const { newUser } = require('./users/newUser')
const { usersById } = require('./users/usersById')
const { usersLogin } = require('./users/usersLogin')
const { allUsers } = require('./users/allUsers')
const { updateUser } = require('./users/updateUsers')
const { sendRequest } = require('./users/sendRequest')

// tutor api's imports
const { newTutor } = require('./tutors/newTutor')
const { updateTutor } = require('./tutors/updateTutor')
const { allTutors } = require('./tutors/allTutors')
const { tutorsById } = require('./tutors/tutorsById')
const { tutorsBySubject } = require('./tutors/tutorsBySubject')
// const { denyRequest } = require('./users/denyRequest')
// const { acceptRequest } = require('./users/acceptRequest')

// Middleware/protected route
const { withAuth } = require('./firebaseAuth')

// image uploaded
const { imgUpload } = require('./users/imgUpload')
const { picUpload } = require('./tutors/picUpload')

// Subjects api's imports
const { subjectById } = require('./subjects/subjectById')
const { allSubjects } = require('./subjects/allSubjects')

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

//TUTORS GET endpoints
app.get('/tutors/allTutors', allTutors)
app.get('/tutors/:id', tutorsById)
app.get('/tutors/subject/:id', tutorsBySubject)

// Tutor POST endpoints
app.post('/tutors/new', newTutor)

// Tutor PUT endpoints: only works with token
app.put('/tutors/edit-profile', withAuth, updateTutor)
app.put('/tutors/image', withAuth, picUpload)
// app.put('/tutors/acceptRequest', acceptRequest)
// app.put('/tutors/denyRequest', denyRequest)

// DTL's api by Luis Obregon and Guillermo Lorca
exports.api = functions.https.onRequest(app)
