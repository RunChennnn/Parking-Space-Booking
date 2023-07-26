import { auth, db } from './firebaseConfig.js';
import { isAdmin } from './authorizer.js'

const getAdminUpcomingBooking = async () => {
  if (!isAdmin()) {
    return {
      status: 401,
      error: 'User Unauthorised'
    }
  }
  try {
    const bookingIDs = [];
    const currentTime = Math.floor(Date.now() / 1000)
    const Bookings = await db.collection('Bookings').where('endTime', '>', currentTime).get()
    Bookings.forEach(booking => bookingIDs.push(booking.id))
    return {
      status: 200,
      bookingIDs,
      message: 'Upcoming bookings for admin retrieved successfully'
    }
  } catch (error) {
    console.error('Error retriving Booking for admin:', error);
    return {
      status: 500,
      message: 'Booking for admin retrival FAILED',
      error: error.message
    };
  }
};

const getAdminHistoryBooking = async () => {
  if (!isAdmin()) {
    return {
      status: 401,
      error: 'User Unauthorised'
    }
  }
  try {
    const bookingIDs = [];
    const currentTime = Math.floor(Date.now() / 1000)
    const Bookings = await db.collection('Bookings').where('endTime', '<=', currentTime).get()
    Bookings.forEach(booking => bookingIDs.push(booking.id))
    return {
      status: 200,
      bookingIDs,
      message: 'Historical bookings for admin retrieved successfully'
    }
  } catch (error) {
    console.error('Error retriving Booking for admin:', error);
    return {
      status: 500,
      message: 'Booking for admin retrival FAILED',
      error: error.message
    };
  }
};

const getUsersForAdmin = async () => {
  if (!isAdmin()) {
    return {
      status: 401,
      error: 'User Unauthorised'
    }
  }
  try {
    const userIDs = [];
    const users = (await auth.listUsers());
    users.users.forEach(user => userIDs.push(user.uid))
    return {
      status: 200,
      userIDs,
      message: 'all userIDs retrieved'
    }
  } catch (error) {
    console.error('Error retriving userIDs for admin:', error);
    return {
      status: 500,
      message: 'userIDs for admin retrival FAILED',
      error: error.message
    };
  }
};

const getSpotsForAdmin = async () => {
  if (!isAdmin()) {
    return {
      status: 401,
      error: 'User Unauthorised'
    }
  }
  try {
    const spotIDs = [];
    const allSpots = await db.collection('Spots').get()
    allSpots.forEach(spot => spotIDs.push(spot.id))
    return {
      status: 200,
      spotIDs,
      message: 'all spotIDs retrieved'
    }
  } catch (error) {
    console.error('Error retriving spotIDs for admin:', error);
    return {
      status: 500,
      message: 'spotIDs for admin retrival FAILED',
      error: error.message
    };
  }
};

const checkAdminAccountID = async (userID) => {
  try {
    const queryResult = await db.collection('Admins').where('uid', '==', userID).get()
    const isAdminAccount = !queryResult.empty
    return {
      status: 200,
      isAdmin: isAdminAccount,
      message: `admin account checked for user ${userID}`
    }
  } catch (error) {
    console.error('Error checking admin account ID:', error);
    return {
      status: 500,
      message: 'admin account check FAILED',
      error: error.message
    };
  }
}

export { getAdminUpcomingBooking, getAdminHistoryBooking, getUsersForAdmin, getSpotsForAdmin, checkAdminAccountID }
