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
    })
    return available
}

//later we will implement surging price
const calculatePrice = async (spotID, startTime, endTime) => {
    const duration = (endTime - startTime)/3600;
    let totalPrice;
    const spot = await db.collection('Spots').doc(spotID).get();
    const basePrice = spot.data().basePrice;
    //assuming based on hours
    totalPrice = basePrice*duration;
    return parseFloat(totalPrice.toFixed(2));
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
            const price = await calculatePrice(spotID, startTime, endTime)
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
                bookingTime: currentTime,
                price: price
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
          message: "Booking confirmation FAILED",
          error: error.message
        };
    }
};

const getPriceForBooking = async (spotID, startTime, endTime) => {
    try {
        const spotExist = await checkSpotExist(spotID);
        const spotAvailable = await checkSpotAvalaibility(spotID,startTime,endTime);
        if (!spotExist) {
            console.log(`Price check Failed: Spot ${spotID} not found`)
            return {
                status: 404,
                error: "Spot does not exist"
            }
        } else if (!spotAvailable) {
            console.log(`Price check Failed: Spot ${spotID} is not availble`)
            return {
                status: 409,
                error: "Spot is not availble"
            }
        } else {
            const price = await calculatePrice (spotID, startTime, endTime);
            console.log("Price retrived successfully");
            return {
              status: 200,
              price: price,
              message: `Price for spot ${spotID} from ${startTime} to ${endTime} retrieved!`
            };
        }
    } catch (error) {
        console.error("Error getting Price:", error);
        return {
          status: 500,
          message: "Price retrieval FAILED",
          error: error.message
        };
    }
};

const calculateRefundAvailability = (bookingTime) => {
    let refundAvailable;
    const currentTime = Math.floor(Date.now() / 1000)
    const hourPast = (currentTime - bookingTime) / 3600
    if ( hourPast <= 1 ) {
        refundAvailable = 1
    } else if ( hourPast <= 12 ) {
        refundAvailable = 0.5
    } else {
        refundAvailable = 0
    }
    return refundAvailable
}

const getBooking = async (bookingID) => {
    try {
        const booking = await db.collection('Bookings').doc(bookingID).get()
        if (!booking.exists) {
            console.log(`Booking retrival Failed: Booking ${bookingID} not found`)
            return {
                status: 404,
                error: "Booking not found"
            }
        } else {
            const data = booking.data();
            const refundAvailable = calculateRefundAvailability(data.bookingTime);
            console.log("Booking retrived successfully");
            return {
              status: 200,
              spotID: data.spotID,
              startTime: data.startTime,
              endTime: data.endTime,
              price: data.price,
              refundAvailable: refundAvailable, // 0 for not available, 1 for 100%, 0.5 for 50%
              rating: data.rating,
              review: data.review,
              message: `booking ${bookingID} retrieved successfully`
            };
            // it is more common to nest all those fields in the response, so as to seperate the data and hyper-info,
            // but i will keep it like this to match the format as in dummy request
        }
    } catch (error) {
        console.error("Error getting Booking:", error);
        return {
          status: 500,
          message: "Booking retrieval FAILED",
          error: error.message
        };
    }
};

const updateReview = async (bookingID, rating, review) => {
    try {
        const bookingRef = db.collection('Bookings').doc(bookingID)
        if (!(await bookingRef.get()).exists) {
            console.log(`Review update Failed: Booking ${bookingID} not found`)
            return {
                status: 404,
                error: "Booking not found"
            }
        } else {
            if (rating) {
                await bookingRef.update({rating:rating})
            }
            if (review) {
                await bookingRef.update({review:review})
            }
            console.log("Review updated successfully");
            return {
              status: 200,
              bid: bookingRef.id,
              message: `Review added or updated successfully`
            };

        }
    } catch (error) {
        console.error("Error updating Review:", error);
        return {
          status: 500,
          message: "Review update FAILED",
          error: error.message
        };
    }
};

const deleteBooking = async (bookingID) => {
    try {
        const bookingRef = db.collection('Bookings').doc(bookingID)
        if (!(await bookingRef.get()).exists) {
            console.log(`Booking deletion Failed: Booking ${bookingID} not found`)
            return {
                status: 404,
                error: "Booking not found"
            }
        } else {
            await bookingRef.delete()
            console.log("Booking deletion successfully");
            return {
              status: 200,
              bid: bookingRef.id,
              message: `Booking deleted successfully`
            };

        }
    } catch (error) {
        console.error("Error deleting Booking:", error);
        return {
          status: 500,
          message: "Booking deletion FAILED",
          error: error.message
        };
    }
};

export { confirmNewBooking, getPriceForBooking, getBooking, updateReview, deleteBooking };
