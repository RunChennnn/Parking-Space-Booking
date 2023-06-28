import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, getIdToken, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, EmailAuthProvider } from "firebase/auth";

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

const checkPasswordNaive = (pwdstr) => {
    const hasUppercase = /[A-Z]/.test(pwdstr) ? 1:0;
    const hasLowercase = /[a-z]/.test(pwdstr) ? 1:0;
    const hasNumbers = /\d/.test(pwdstr) ? 1:0;

    const hasCount = hasUppercase + hasLowercase + hasNumbers;
    return (pwdstr.length >=8 && hasCount >= 2);
}

const registerNewAccount = async (email, password) => {
    try {
        if (!checkPasswordNaive(password)) {
            console.log("Error creating account, weak password")
            return ({
                status: 400,
                message: "Account creation FAILED",
                error: "Weak Password"
            })
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await getIdToken(userCredential.user);
            console.log("Account Created: ", userCredential.user.uid);
    
            return ({
                status: 201,
                userID: userCredential.user.uid,
                token: token,
                message: "Account successfully created"
            });
        }
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
            userID: userCredential.user.uid,
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

const authAccountwithPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(userCredential.user);

        return {
            status: 200,
            message: "Passoword match"
        }
    } catch (error) {
        console.log("Error validating password: ", error.message);
        return {
            status: 400,
            message: "Password not match",
            error: error.message
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


export { registerNewAccount, signInAccount, deleteAccount, signOutAccount, authAccountwithPassword };