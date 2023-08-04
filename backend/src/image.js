import { auth, db } from './firebaseConfig.js'

const setUserImage = async (userID, image) => {
  try {
    await auth.getUser(userID)
    await db.collection('UserImages').doc(userID).set({ image })
    console.log('New user image added to database');
    return {
      status: 200,
      message: `User Image update successfully for user ${userID}`
    };
  } catch (error) {
    console.error('Error adding image to the database:', error);
    if (error.code === 'auth/user-not-found') {
      return {
        status: 404,
        message: 'User NOT FOUND',
        error: error.message
      }
    } else {
      return {
        status: 500,
        message: 'Image update FAILED',
        error: error.message
      };
    }
  }
};

const getUserImage = async (userID) => {
  try {
    const record = await db.collection('UserImages').doc(userID).get()
    const image = record.exists ? record.data().image : null
    console.log(`User image retrived for user ${userID}`);
    return {
      status: 200,
      image,
      message: 'User Image successfully retrieved'
    };
  } catch (error) {
    console.error('Error getting user image:', error);
    return {
      status: 500,
      message: 'Image retrieval FAILED',
      error: error.message
    };
  }
};

const setSpotImage = async (spotID, image) => {
  try {
    const targetSpotRef = db.collection('Spots').doc(spotID)
    if ((await targetSpotRef.get()).exists) {
      await db.collection('SpotImages').doc(spotID).set({ image })
      console.log(`User image set for spot ${spotID}`);
      return {
        status: 200,
        message: 'Spot Image updated successfully'
      };
    } else {
      return {
        status: 404,
        error: `Spot ${spotID} not found.`
      }
    }
  } catch (error) {
    console.error('Error adding image to the database:', error);
    return {
      status: 500,
      message: 'Image update FAILED',
      error: error.message
    };
  }
};

const getSpotImage = async (spotID) => {
  try {
    const record = await db.collection('SpotImages').doc(spotID).get()
    const image = record.exists ? record.data().image : null
    console.log(`User image retrived for spot ${spotID}`);
    return {
      status: 200,
      image,
      message: 'Spot Image successfully retrieved'
    };
  } catch (error) {
    console.error('Error getting spot image:', error);
    return {
      status: 500,
      message: 'Image retrieval FAILED',
      error: error.message
    };
  }
};

export { setUserImage, getUserImage, setSpotImage, getSpotImage }
