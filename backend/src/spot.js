import { getDatabase, ref, get, set, push, update, remove } from 'firebase/database';
import { db } from './firebaseConfig.js'

const createNewSpot = async (data) => {
    try {
        const newSpot = await db.collection('Spots').add(data)
        const sid = newSpot.id
    
        console.log("New Spot added to database");
        return {
          status: 201,
          id: sid,
          message: "Spot created successfully"
        };
    } catch (error) {
        console.error("Error adding Spot to the database:", error);
        return {
          status: 500,
          message: "Spot creation FAILED",
          error: error.message
        };
    }
};

const patchSpot = async (spotId, data) => {
    try {
      const targetSpotRef = db.collection('Spots').doc(spotId)
      if ((await targetSpotRef.get()).exists){
        await targetSpotRef.update(data);
        console.log(`Spot ${spotId} updated in the database`);
        return {
            status: 200,
            message: `Spot ${spotId} updated successfully`
        };
      } else {
        console.log(`Spot ${spotId} does not exist`);
        return {
            status: 404,
            message: `Spot ${spotId} not found.`
        };
      }

    } catch (error) {
      console.error("Error updating spot:", error);
      return {
        status: 500,
        message: "Spot update FAILED",
        error: error.message
      };
    }
};

const deleteSpot = async (spotId) => {
    try {
      const targetSpotRef = db.collection('Spots').doc(spotId)
      if ((await targetSpotRef.get()).exists){
        await targetSpotRef.delete();
        console.log(`Spot ${spotId} removed in the database`);
        return {
            status: 200,
            message: `Spot ${spotId} deletion successfully`
        };
      } else {
        console.log(`Spot ${spotId} does not exist`);
        return {
            status: 404,
            message: `Spot ${spotId} not found.`
        };
      }

    } catch (error) {
      console.error("Error deleting spot:", error);
      return {
        status: 500,
        message: "Spot deletion FAILED",
        error: error.message
      };
    }
};

const getSpot = async (spotId) => {
  try {
    const targetSpot = await db.collection('Spots').doc(spotId).get()
    if (targetSpot.exists) {
      const spotData = targetSpot.data();
      console.log(`Spot ${spotId} infomation retrived from the database`, spotData);
      return {
        status: 200,
        message: `Spot retrieved successfully`,
        id: spotId,
        data: spotData
      };
    } else {
      console.log(`Spot ${spotId} does not exist`);
      return {
        status: 404,
        message: `Spot ${spotId} not found`
      };
    }
  } catch (error) {
    console.error("Error getting spot:", error);
    return {
      status: 500,
      message: "Spot retrieval FAILED",
      error: error.message
    };
  }
};

export { createNewSpot, patchSpot, deleteSpot, getSpot }
