require('dotenv').config(); // Required for reading environment variables

// Import the functions you need from the SDKs you need
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

initializeApp({
    credential: applicationDefault(),
    // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

const db = getFirestore();

module.exports = { db };
