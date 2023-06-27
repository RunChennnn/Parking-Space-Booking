import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, getIdToken, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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

const registerNewAccount = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(userCredential.user);
        console.log("Account Created: ", userCredential.user.uid);

        return ({
            status: 201,
            uid: userCredential.user.uid,
            token: token,
            message: "Account successfully created"
        });
    } catch (error) {
        console.log("Error creating account: ", error.message);

        return ({
            status: 500,
            message: "Account creation FAILED",
            error: error.message
        });
    }
}

const signInAccount = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(userCredential.user);
        console.log("Signed in successfully: ", userCredential.user.uid);
        
        return ({
            status: 200,
            uid: userCredential.user.uid,
            token: token,
            message: "Signed in successfully"
        });
    } catch (error) {
        console.log("Error signing in: ", error.message);

        return ({
            status: 500,
            message: "Signed in FAILED",
            error: error.message
        });
    }
}

const deleteAccount = async (uid) => {
    const user = auth.currentUser;

    if (user && user.uid === uid) {
        try {
            await user.delete();
            console.log("Account Deleted: ", uid);
            return {
                status: 200,
                message: "Account successfully deleted"
            };
        } catch (error) {
            console.log("Error deleting account: ", error.message);
            return {
                status: 500,
                message: "Account deletion FAILED",
                error: error.message
            };
        }
    } else {
        console.log("This user not signed in");
        return {
            status: 401,
            message: "User not signed in"
        };
    }
}

const signOutAccount = async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out: ', error);
    }
};


export { registerNewAccount, signInAccount, deleteAccount, signOutAccount };