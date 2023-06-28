import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, query, equalTo, orderByChild } from 'firebase/database';
import { getAuth } from "firebase/auth";
import admin from 'firebase-admin';
import { createRequire } from 'module';

// cannot import json directly in latest version, have to do this
const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

const firebaseConfig = {
    apiKey: "AIzaSyApBdX_ouOp0E9Bez09PtHyMa4UL-qDYBo",
    authDomain: "room-e5563.firebaseapp.com",
    projectId: "room-e5563",
    storageBucket: "room-e5563.appspot.com",
    messagingSenderId: "665563320009",
    appId: "1:665563320009:web:2bff29562834fdf4bac718",
    measurementId: "G-1NXQ4FX22V",
    databaseURL: "https://room-e5563-default-rtdb.asia-southeast1.firebasedatabase.app"
};
const firebase = initializeApp(firebaseConfig);
const db = getDatabase(firebase);
const auth = getAuth(firebase);

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const getUser = async (userId) => {
    try {
        // note admin.auth().getUser() is a different thing!
        const userRecord = await admin.auth().getUser(userId)

        const spotRef = ref(db, `/Spots`);
        const userSpotRef = query(spotRef,orderByChild("owner"), equalTo(userId));

        const email = userRecord.email
        const upcoming = ["this1SafAKeID", "aN01theR_0ne"]
        const history = ["historyID1","historyID2","historyID3"]
        const spots =  []

        const snapshot = await get(userSpotRef);
        snapshot.forEach((spotshot) => {spots.push(spotshot.key);});

        console.log(`User ${userId} infomation retrived from the database`);
        return {
            status: 200,
            message: "User information retrieval successfully",
            email: email,
            upcoming: upcoming,
            history: history,
            spots: spots
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        if (error.code === 'auth/user-not-found') {
            return {
                status: 404,
                message: "User NOT FOUND",
                error: error.message
            }
        } else {
            return {
                status: 500,
                message: "User profile retrieval FAILED",
                error: error.message
            };
        }
    }
};

const patchUser = async (userId, data) => {
    try {
        // note admin.auth().getUser() is not the getUser we defined earlier!
        const userRecord = await admin.auth().getUser(userId)
        console.log(`User ${userId} infomation updated in database`);
        return {
            status: 200,
            message: `User ${spotId} information update successfully`,
        }
    } catch (error) {
        console.error("Error user not found:", error);
        if (error.code === 'auth/user-not-found') {
            return {
                status: 404,
                message: "User NOT FOUND",
                error: error.message
            }
        } else {
            return {
                status: 500,
                message: "User profile update FAILED",
                error: error.message
            };
        }
    }
};


export { getUser, patchUser };
