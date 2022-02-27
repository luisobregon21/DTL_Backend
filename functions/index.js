// Firebase Functions
const functions = require('firebase-functions')

// users api's imports
const { newUser } = require('./users/newUser')
const { usersById } = require('./users/usersById')
const { usersLogin } = require('./users/usersLogin')
const { allUsers } = require('./users/allUsers')
// const { withAuth } = require('./with-auth')
// here will go the procted route - middleware

// interests api's imports
const { interestById } = require('./interests/interestById')
const { allInterests } = require('./interests/allInterests')

// Initialize express and set up cors
const app = require('express')()

const cors = require('cors')
app.use(
    cors({
        origin: '*',
    })
)

// Users Popst endpoints
app.post('/users/new', newUser)
app.post('/users/login', usersLogin)

// User Get endpoints
app.get('/users/allUsers', allUsers)
app.get('/users/:id', usersById)

// User Get endpoints
app.get('/interests/allInterests', allInterests)
app.get('/interests/:id', interestById)

// DTL's api by Luis Obregon and Guillermo Lorca
exports.api = functions.https.onRequest(app)
