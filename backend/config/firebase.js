const admin = require('firebase-admin');
require('dotenv').config();

// Load Firebase service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// Firestore database
const db = admin.firestore();

// Prevent errors if undefined fields are sent
db.settings({ ignoreUndefinedProperties: true });

module.exports = db;