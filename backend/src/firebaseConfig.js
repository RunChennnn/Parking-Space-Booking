import { createRequire } from 'module';
import admin from 'firebase-admin';

const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

//credential: admin.credential.cert(serviceAccount)
const firebaseConfig = {
    apiKey: "AIzaSyApBdX_ouOp0E9Bez09PtHyMa4UL-qDYBo",
    authDomain: "room-e5563.firebaseapp.com",
    projectId: "room-e5563",
    storageBucket: "room-e5563.appspot.com",
    messagingSenderId: "665563320009",
    appId: "1:665563320009:web:2bff29562834fdf4bac718",
    measurementId: "G-1NXQ4FX22V",
    databaseURL: "https://room-e5563-default-rtdb.asia-southeast1.firebasedatabase.app",
};

//Server side Initialization
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const db = admin.firestore();
const auth = admin.auth();

export { firebaseConfig, db, auth }