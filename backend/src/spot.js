import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, update, remove } from 'firebase/database';
import { getAuth } from "firebase/auth";

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

const createNewSpot = async (data) => {
    try {
        const dataRef = ref(db, '/Spots');
        const newSpot = push(dataRef)
        await set(newSpot, data)
        const sid = newSpot.key
    
        console.log("New Spot added to database");
        return {
          status: 200,
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
      const spotRef = ref(db, `/Spots/${spotId}`);
      const snapshot = await get(spotRef);

      if (snapshot.exists()){
        await update(spotRef, data);
    
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
      const spotRef = ref(db, `/Spots/${spotId}`);
      const snapshot = await get(spotRef);

      if (snapshot.exists()){
        await remove(spotRef);
    
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

export { createNewSpot, patchSpot, deleteSpot }
