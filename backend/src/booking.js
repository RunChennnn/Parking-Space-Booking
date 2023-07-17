import { db } from './firebaseConfig.js';

const checkSpotExist = async (spotID) => {
    const exist = (await db.collection('Spots').doc(spotID).get()).exists ? true:false;
    return exist
}

const checkSpotAvalaibility = async (spotID,startTime,endTime) => {
    let available = true
    const spotBookings = await db.collection('Bookings').where("spotID", "==", spotID).get();
    spotBookings.forEach(booking => { 
        if ((booking.data().startTime >= startTime) && (booking.data().startTime <= endTime)) {
            available = false;
        }
        if ((booking.data().endTime >= startTime) && (booking.data().endTime <= endTime)) {
            available = false;
        }
        if ((booking.data().startTime <= startTime) && (booking.data().endTime >= endTime)) {
            available = false;
        }
        console.log(booking.data().startTime,booking.data().endTime, startTime, (booking.data().startTime >= startTime) && (booking.data().startTime <= endTime))
    })
    return available
}

const confirmNewBooking = async (spotID, userID, startTime, endTime, cardNumber, cardName, cardCvv) => {
    try {
        const spotExist = await checkSpotExist(spotID);
        const spotAvailable = await checkSpotAvalaibility(spotID,startTime,endTime);
        if (!spotExist) {
            console.log(`Booking Failed: Spot ${spotID} not found`)
            return {
                status: 404,
                error: "Spot does not exist"
            }
        } else if (!spotAvailable) {
            console.log(`Booking Failed: Spot ${spotID} is not availble`)
            return {
                status: 409,
                error: "Spot is not availble"
            }
        } else {
            const currentTime = Math.floor(Date.now() / 1000)
            const data = {
                spotID: spotID,
                userID: userID,
                startTime: startTime,
                endTime: endTime,
                cardNumber: cardNumber,
                cardName: cardName,
                cardCvv: cardCvv,
                rating: null,
                review: null,
                bookingTime: currentTime
            }
            
            const newBooking = await db.collection('Bookings').add(data)
            const bid = newBooking.id
        
            console.log("New Booking added to database");
            return {
              status: 201,
              id: bid,
              message: "New Booking confirmed"
            };
        }
    } catch (error) {
        console.error("Error confirming Booking:", error);
        return {
          status: 500,
          message: "Spot creation FAILED",
          error: error.message
        };
    }
};

export { confirmNewBooking };
