import { db, auth } from './firebaseConfig.js';
import { getDatabase, ref, get, update, query, equalTo, orderByChild } from 'firebase/database';
import admin from 'firebase-admin';

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

const users = new Object();
const getUserBasic = async (userId) => {
    try {
        if (users[userId]) {
            return users[userId]
        }

        // note admin.auth().getUser() is a different thing!
        const userRecord = await admin.auth().getUser(userId)
        const email = userRecord.email


        const data = {
            status: 200,
            message: "User information retrieval successfully",
            email: email,
        };
        users[userId] = data;

        console.log(`User ${userId} infomation retrived from the database`);
        return {
            status: 200,
            message: "User information retrieval successfully",
            email: email,
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


const checkPasswordNaive = (pwdstr) => {
    const hasUppercase = /[A-Z]/.test(pwdstr) ? 1:0;
    const hasLowercase = /[a-z]/.test(pwdstr) ? 1:0;
    const hasNumbers = /\d/.test(pwdstr) ? 1:0;

    const hasCount = hasUppercase + hasLowercase + hasNumbers;
    return (pwdstr.length >=8 && hasCount >= 2);
}

const patchUser = async (userId, data) => {
    try {
        // note admin.auth().getUser() is not the getUser we defined earlier!
        // const userRecord = await admin.auth().getUser(userId);

        if (data.hasOwnProperty("password")) {
            const newPassword = data.password;
            if (!checkPasswordNaive(newPassword)) {
                throw new Error('Error: Weak Passord');
            } else {
            await admin.auth().updateUser(userId, { password: newPassword});
            }
        }
        if (data.hasOwnProperty("email")) {
            const newEmail = data.email;
            await admin.auth().updateUser(userId, { email: newEmail});
        }

        
        console.log(`User ${userId} infomation updated in database`);
        delete users[userId]
        getUserBasic(userId);
        return {
            status: 200,
            message: `User ${userId} information update successfully`,
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


export { getUser, getUserBasic, patchUser };
