// Firebase Functions
const functions = require('firebase-functions')

// users api's imports
const { newUser } = require('./users/newUser')
const { usersById } = require('./users/usersById')
const { usersLogin } = require('./users/usersLogin')
const { allUsers } = require('./users/allUsers')
const { updateUser } = require('./users/updateUsers')

// tutor api's imports
const { newTutor } = require('./tutors/newTutor')

// Middleware/protected route
const { withAuth } = require('./firebaseAuth')

// image uploaded
const { imgUpload } = require('./users/imgUpload')

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

// User Get endpoints
app.get('/subjects/allSubjects', allSubjects)
app.get('/subjects/:id', subjectById)

// Tutor POST endpoints
app.post('/tutors/new', newTutor)

// DTL's api by Luis Obregon and Guillermo Lorca
exports.api = functions.https.onRequest(app)
