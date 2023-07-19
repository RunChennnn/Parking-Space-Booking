import { db } from "./firebaseConfig.js";

const calculateSimilarityScores = async (spotData, refSpotsData) => {
  let similarityScore = 0
  // I declare all fields explicitly here on purpose to make it clear what is used in recommend criteria
  const streetName = spotData.streetName;
  const streetNumber = spotData.streetNumber
  const suburb = spotData.suburb;
  const owner = spotData.owner;
  const evCharging = spotData.evCharging;
  const largestVehicle = spotData.largestVehicle;
  const disabledAccess = spotData.disabledAccess;
  const clearance = spotData.clearance;
  const basePrice = spotData.basePrice;

  refSpotsData.forEach( refSpot => {
    if (streetName ===  refSpot.streetName) {
      similarityScore += 3
    }
    if (suburb ===  refSpot.suburb) {
      similarityScore += 1
    }
    if (streetNumber ===  refSpot.streetNumber) {
      similarityScore += 1
    }
    if (owner ===  refSpot.owner) {
      similarityScore += 1
    }
    if (evCharging ===  refSpot.evCharging) {
      similarityScore += 8
    }
    if (largestVehicle ===  refSpot.largestVehicle) {
      similarityScore += 1
    }
    if (disabledAccess ===  refSpot.disabledAccess) {
      similarityScore += 5
    }
    if (clearance >=  refSpot.clearance) {
      similarityScore += 3
    }
    if (basePrice >=  refSpot.basePrice) {
      const priceSimilarity = Math.pow(refSpot.basePrice/basePrice, 2)*2
      similarityScore += priceSimilarity
    }
    if (basePrice <  refSpot.basePrice) {
      const priceSimilarity = Math.pow(basePrice/refSpot.basePrice, 4)*2
      similarityScore += priceSimilarity
    }
  })
  return similarityScore
}

const evaluateAndSort = async (potentialSpots, previousSpotsData ) => {
  let spotScores = [];
  potentialSpots.forEach(async spot => {
    spotScores.push({id:spot.id, score: await calculateSimilarityScores(spot.data(), previousSpotsData)})
    spotScores.sort((a,b)=> b.score - a.score)
  })
  return spotScores;
}

const recommendSpot = async (uid, num, alreadyReceived) => {
    try {
      let spotList = []
      const previousBookings = await db.collection('Bookings').where('userID', '==', uid).limit(5).get();
      let previousSpotsData = []
      previousBookings.forEach(async (booking) => {
        const sid = booking.data().spotID;
        const spotData = await db.collection('Spots').doc(sid).get();
        previousSpotsData.push(spotData.data())
      })

      const spotRef = db.collection('Spots').where('owner', '!=', uid);
      const potentialSpots = await spotRef.get();
      let spotScores = await evaluateAndSort(potentialSpots, previousSpotsData);

      if (!potentialSpots.empty) {
        let count = 0 
        spotScores.forEach(spot => {
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
          scores: spotScores,
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