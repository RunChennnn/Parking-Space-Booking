import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, query } from 'firebase/database';

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

const recommendSpot = async (uid, num, alreadyReceived) => {
    try {
      let spotList = []
      const spotRef = ref(db, `/Spots`);
      const snapshot = await get(spotRef);
  
      if (snapshot.exists()) {
        let count = 0 
        snapshot.forEach(spotshot => {
            if (count < num && !alreadyReceived.includes(spotshot.key)) {
                spotList.push(spotshot.key);
                count ++;
            }
        });
        console.log(`${spotList.length} Spots recommended for user ${uid}`, spotList);
        return {
          status: 200,
          message: `${spotList.length} Spots successfully recommended`,
          ids: spotList,
        };
      } else {
        console.log(`Database is empty, unable to give recommendation`);
        return {
          status: 404,
          message: `No spot record in database`
        };
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return {
        status: 500,
        message: "Spot recommendation FAILED",
        error: error.message
      };
    }
};

//implement search by set query conditions
const queryByConditions= (databaseRef, condtions) => {
    const search = condtions.search
    console.log(`queryByConditions found condition ${search}`)
    return query(databaseRef)
};

const searchSpot = async (num, alreadyReceived, conditions) => {
    try {
      let spotList = []
      const spotRef = ref(db, `/Spots`);
      const searchedSpotRef = queryByConditions(spotRef , conditions);
      const snapshot = await get(searchedSpotRef);
  
      if (snapshot.exists()) {
        let count = 0 
        snapshot.forEach(spotshot => {
            if (count < num && !alreadyReceived.includes(spotshot.key)) {
                spotList.push(spotshot.key);
                count ++;
            }
        });
        console.log(`Seach success, ${spotList.length} Spots retrieved`, spotList);
        return {
          status: 200,
          message: `${spotList.length} Spots successfully retrieved`,
          ids: spotList,
          conditions: conditions
        };
      } else {
        console.log(`Search requested, but database is empty`);
        return {
          status: 404,
          message: `No spot record in database`
        };
      }
    } catch (error) {
      console.error("Error performing search:", error);
      return {
        status: 500,
        message: "Spot search FAILED",
        error: error.message
      };
    }
};

export { recommendSpot, searchSpot };