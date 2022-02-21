const { Timestamp } = require('firebase-admin/firestore')
const { db } = require('../admin_init')
const { createUserWithEmailAndPassword } = require('firebase/auth')
const { auth } = require('../app_init')
