import { db, auth } from './firebaseConfig.js';
import { checkPasswordNaive } from './account.js'

const getUser = async (userId) => {
  try {
    // auth.getUser() is a different thing!
    const userRecord = await auth.getUser(userId)
    const email = userRecord.email
    const displayName = userRecord.displayName
    let upcoming = []
    let history = []
    const spots = []

    const spotRef = db.collection('Spots')
    const userSpots = await spotRef.where('owner', '==', userId).get();
    // assuming the upcoming and history are the user as renter.
    const currentTime = Math.floor(Date.now() / 1000)
    const upcomingBookingsRenter = await db.collection('Bookings').where('userID', '==', userId).where('endTime', '>', currentTime).get()
    const upcomingBookingsOwner = await db.collection('Bookings').where('ownerID', '==', userId).where('endTime', '>', currentTime).get()
    const historyBookingsRenter = await db.collection('Bookings').where('userID', '==', userId).where('endTime', '<=', currentTime).get()
    const historyBookingsOwner = await db.collection('Bookings').where('ownerID', '==', userId).where('endTime', '<=', currentTime).get()

    upcomingBookingsRenter.forEach(booking => upcoming.push({ id: booking.id, time: booking.data().startTime }))
    upcomingBookingsOwner.forEach(booking => upcoming.push({ id: booking.id, time: booking.data().startTime }))
    historyBookingsRenter.forEach(booking => history.push({ id: booking.id, time: booking.data().startTime }))
    historyBookingsOwner.forEach(booking => history.push({ id: booking.id, time: booking.data().startTime }))
    userSpots.forEach((spot) => { spots.push(spot.id); });

    // sort by startTime and give bookingID only
    upcoming.sort((a, b) => a.time - b.time)
    history.sort((a, b) => a.time - b.time)
    upcoming = upcoming.map(record => record.id)
    history = history.map(record => record.id)

    console.log(`User ${userId} infomation retrived from the database`);
    return {
      status: 200,
      message: 'User information retrieval successfully',
      email,
      displayName,
      upcoming,
      history,
      spots
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    if (error.code === 'auth/user-not-found') {
      return {
        status: 404,
        message: 'User NOT FOUND',
        error: error.message
      }
    } else {
      return {
        status: 500,
        message: 'User profile retrieval FAILED',
        error: error.message
      };
    }
  }
};

const usersEmail = {};
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
      message: 'User information retrieval successfully',
      email,
    };
    usersEmail[userId] = data;

    console.log(`User ${userId} infomation retrived from the database`);
    return {
      status: 200,
      message: 'User information retrieval successfully',
      email,
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    if (error.code === 'auth/user-not-found') {
      return {
        status: 404,
        message: 'User NOT FOUND',
        error: error.message
      }
    } else {
      return {
        status: 500,
        message: 'User profile retrieval FAILED',
        error: error.message
      };
    }
  }
};

const patchUser = async (userId, data) => {
  try {
    if (data.password) {
      const newPassword = data.password;
      if (!checkPasswordNaive(newPassword)) {
        throw new Error('Error: Weak Passord');
      } else {
        await auth.updateUser(userId, { password: newPassword });
      }
    }
    if (data.email) {
      const newEmail = data.email;
      await auth.updateUser(userId, { email: newEmail });
      const ownedSpots = await db.collection('Spots').where('owner', '==', userId).get()
      ownedSpots.forEach(async spot => await db.collection('Spots').doc(spot.id).update({ ownerEmail: newEmail }))
    }
    if (data.displayName) {
      const newDisplayName = data.displayName;
      await auth.updateUser(userId, { displayName: newDisplayName });
    }
    console.log(`User ${userId} infomation updated in database`);
    delete usersEmail[userId]
    return {
      status: 200,
      message: `User ${userId} information update successfully`,
    }
  } catch (error) {
    console.error('Error user not found:', error);
    if (error.code === 'auth/user-not-found') {
      return {
        status: 404,
        message: 'User NOT FOUND',
        error: error.message
      }
    } else {
      return {
        status: 500,
        message: 'User profile update FAILED',
        error: error.message
      };
    }
  }
};

export { getUser, getUserBasic, patchUser };
