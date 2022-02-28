// Firebase App
const { initializeApp: initializeClientApp } = require('firebase/app')
const { getAuth: getClientAuth } = require('firebase/auth')

// Initialize Client
const firebaseConfig = {
    apiKey: 'AIzaSyB1P0OEYJCni4Yw4yWCLt3iL5cBPANHGrc',
    authDomain: 'dtl-mvp.firebaseapp.com',
    projectId: 'dtl-mvp',
    storageBucket: 'dtl-mvp.appspot.com',
    messagingSenderId: '743117004506',
    appId: '1:743117004506:web:0d2cc5998b1d0b3aaf4fe3',
    measurementId: 'G-Z378M3SGZP',
}
// initializing app
initializeClientApp(firebaseConfig)
const auth = getClientAuth()

exports.firebaseConfig = firebaseConfig
exports.auth = auth
