import { db, auth } from './firebaseConfig.js';
import { checkPasswordNaive } from './account.js'

const getUser = async (userId) => {
    try {
        // auth.getUser() is a different thing!
        const userRecord = await auth.getUser(userId)

        const spotRef = db.collection('Spots')
        const userSpots = await spotRef.where('owner', '==', userId).get();

        const email = userRecord.email
        const upcoming = ["this1SafAKeID", "aN01theR_0ne"]
        const history = ["historyID1","historyID2","historyID3"]
        const spots =  []

        userSpots.forEach((spot) => {spots.push(spot.id);});

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

const usersEmail = new Object();
const getUserBasic = async (userId) => {
    try {
        if (usersEmail[userId]) {
            return usersEmail[userId]
        }
        // note admin.auth().getUser() is a different thing!
        const userRecord = await auth.getUser(userId)
        const email = userRecord.email

        const data = {
            status: 200,
            message: "User information retrieval successfully",
            email: email,
        };
        usersEmail[userId] = data;

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

const patchUser = async (userId, data) => {
    try {
        if (data.hasOwnProperty("password")) {
            const newPassword = data.password;
            if (!checkPasswordNaive(newPassword)) {
                throw new Error('Error: Weak Passord');
            } else {
            await auth.updateUser(userId, { password: newPassword});
            }
        }
        if (data.hasOwnProperty("email")) {
            const newEmail = data.email;
            await auth.updateUser(userId, { email: newEmail});
        }
        console.log(`User ${userId} infomation updated in database`);
        delete usersEmail[userId]
        // I removed getUser() in this line, it don't see why it needs to be called - Nick
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
