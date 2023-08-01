import { db } from './firebaseConfig.js';

// https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/
function longestCommonSubsequence (a, b) {
  try {
    a = a.toLowerCase();
    b = b.toLowerCase();

    // Dynamic programming setup
    const arr = new Array(a.length + 1)
    for (let i = 0; i < a.length + 1; i++) {
      arr[i] = new Array(b.length + 1).fill(-1);
    }

    function doLCS (aIndex, bIndex) {
      // Exit if we reached the end
      if (aIndex === 0 || bIndex === 0) { return 0; }

      // Case where characters match
      if (a[aIndex - 1] === b[bIndex - 1]) {
        arr[aIndex][bIndex] = 1 + doLCS(aIndex - 1, bIndex - 1);
        return arr[aIndex][bIndex];
      }

      if (arr[aIndex][bIndex] !== -1) {
        return arr[aIndex][bIndex];
      }

      arr[aIndex][bIndex] = Math.max(doLCS(aIndex - 1, bIndex), doLCS(aIndex, bIndex - 1));
      return arr[aIndex][bIndex];
    }
    return doLCS(a.length, b.length);
  } catch (error) {
    return 0;
  }
}

const vehicleSize = (s) => {
  if (s === 'Motorbike') return 1;
  if (s === 'Sedan') return 2;
  if (s === '4WD') return 3;
  if (s === 'Van') return 4;
  if (s === 'Truck') return 5;
  return 0;
}

const calculateSimilarityScores = async (spotData, refSpotsData, request) => {
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
  const postcode = spotData.postcode;
  const email = spotData.ownerEmail;

  // Search-specific stuff
  const searchableAddress = `${streetNumber} ${streetName} ${suburb} ${postcode}`
  similarityScore += longestCommonSubsequence(request.search, searchableAddress) * 50;
  similarityScore += longestCommonSubsequence(request.search, email) * 25;

  // Recommendation stuff
  refSpotsData.forEach(refSpot => {
    if (streetName === refSpot.streetName) {
      similarityScore += 3
    }
    if (suburb === refSpot.suburb) {
      similarityScore += 1
    }
    if (streetNumber === refSpot.streetNumber) {
      similarityScore += 1
    }
    if (owner === refSpot.owner) {
      similarityScore += 1
    }
    if (evCharging === refSpot.evCharging) {
      similarityScore += 8
    }
    if (largestVehicle === refSpot.largestVehicle) {
      similarityScore += 1
    }
    if (disabledAccess === refSpot.disabledAccess) {
      similarityScore += 5
    }
    if (clearance >= refSpot.clearance) {
      similarityScore += 3
    }
    if (basePrice >= refSpot.basePrice) {
      const priceSimilarity = Math.pow(refSpot.basePrice / basePrice, 2) * 2
      similarityScore += priceSimilarity
    }
    if (basePrice < refSpot.basePrice) {
      const priceSimilarity = Math.pow(basePrice / refSpot.basePrice, 4) * 2
      similarityScore += priceSimilarity
    }
  })

  // Set to zero if unusable
  if (request.evCharging) {
    if (!evCharging) { similarityScore = -1; }
  }

  if (request.disabledAccess) {
    if (!disabledAccess) { similarityScore = -1; }
  }

  if (request.minClearance) {
    if (request.clearance > clearance) { similarityScore = -1; }
  }

  if (request.maxPrice) {
    if (request.maxPrice < basePrice) { similarityScore = -1; }
  }
  console.log(request);
  if (request.vehicleType) {
    if (vehicleSize(request.vehicleType) > vehicleSize(largestVehicle)) { similarityScore = -1; }
  }

  return similarityScore
}

const evaluateAndSort = async (potentialSpots, previousSpotsData, request) => {
  const spotScores = [];
  potentialSpots.forEach(async spot => {
    const score = await calculateSimilarityScores(spot.data(), previousSpotsData, request);
    if (score === -1) return;
    spotScores.push({ id: spot.id, score })
    spotScores.sort((a, b) => b.score - a.score)
  })
  return spotScores;
}

const recommendSpot = async (request) => {
  try {
    console.log('REQUEST');
    console.log(request)

    const uid = request.uid
    const num = request.num;
    const alreadyReceived = request.alreadyReceived;
    const spotList = []
    const previousBookings = await db.collection('Bookings').where('userID', '==', uid).limit(5).get();
    const previousSpotsData = []
    previousBookings.forEach(async (booking) => {
      const sid = booking.data().spotID;
      const spotData = await db.collection('Spots').doc(sid).get();
      previousSpotsData.push(spotData.data())
    })

    const spotRef = db.collection('Spots').where('owner', '!=', uid);
    const potentialSpots = await spotRef.get();
    const spotScores = await evaluateAndSort(potentialSpots, previousSpotsData, request);

    if (!potentialSpots.empty) {
      let count = 0
      spotScores.forEach(spot => {
        if (count < num && !alreadyReceived.includes(spot.id)) {
          spotList.push(spot.id);
          count++;
        }
      });
      // console.log(`${spotList.length} Spots recommended for user ${uid}`, spotList);
      return {
        status: 200,
        message: `${spotList.length} Spots successfully recommended`,
        ids: spotList,
        scores: spotScores,
      };
    } else {
      // console.log(`Database is empty, unable to give recommendation`);
      return {
        status: 404,
        message: 'No spot record in database'
      };
    }
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      status: 500,
      message: 'Spot recommendation FAILED',
      error: error.message
    };
  }
};

// implement search by set query conditions
const queryByConditions = (databaseRef, condtions) => {
  let query = databaseRef;
  if (condtions.maxPrice) {
    query = query.where('basePrice', '<=', condtions.maxPrice)
  }
  // console.log(`queryByConditions found condition ${search}`)
  return query
};

const searchSpot = async (num, alreadyReceived, conditions) => {
  try {
    const spotList = []
    const spotRef = db.collection('Spots');
    const spotQuery = queryByConditions(spotRef, conditions);
    const snapshot = await spotQuery.get();

    if (!snapshot.empty) {
      let count = 0
      snapshot.forEach(spot => {
        if (count < num && !alreadyReceived.includes(spot.id)) {
          spotList.push(spot.id);
          count++;
        }
      });
      // console.log(`Seach success, ${spotList.length} Spots retrieved`, spotList);
      return {
        status: 200,
        message: `${spotList.length} Spots successfully retrieved`,
        ids: spotList,
        conditions
      };
    } else {
      // console.log(`Search requested, but database is empty`);
      return {
        status: 404,
        message: 'No spot record in database'
      };
    }
  } catch (error) {
    console.error('Error performing search:', error);
    return {
      status: 500,
      message: 'Spot search FAILED',
      error: error.message
    };
  }
};

export { recommendSpot, searchSpot };
