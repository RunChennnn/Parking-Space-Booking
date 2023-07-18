import { db } from "./firebaseConfig.js";

const recommendSpot = async (uid, num, alreadyReceived) => {
    try {
      let spotList = []
      const spotRef = db.collection('Spots');
      const snapshot = await spotRef.get();
  
      if (!snapshot.empty) {
        let count = 0 
        snapshot.forEach(spot => {
            if (count < num && !alreadyReceived.includes(spot.id)) {
                spotList.push(spot.id);
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
    let query = databaseRef;
    if (condtions.maxPrice) {
      query = query.where('basePrice', "<=", condtions.maxPrice)
    }
    const search = condtions.search
    console.log(`queryByConditions found condition ${search}`)
    return query
};

const searchSpot = async (num, alreadyReceived, conditions) => {
    try {
      let spotList = []
      const spotRef = db.collection('Spots');
      const spotQuery = queryByConditions(spotRef , conditions);
      const snapshot = await spotQuery.get();
  
      if (!snapshot.empty) {
        let count = 0 
        snapshot.forEach(spot => {
            if (count < num && !alreadyReceived.includes(spot.id)) {
                spotList.push(spot.id);
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