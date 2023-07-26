import { db } from './firebaseConfig.js';

const checkSpotExist = async (spotID) => {
  const exist = !!(await db.collection('Spots').doc(spotID).get()).exists;
  return exist
}

const checkSpotAvalaibility = async (spotID, startTime, endTime) => {
  let available = true
  const spotBookings = await db.collection('Bookings').where('spotID', '==', spotID).get();
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

// implement surging price
const calculatePrice = async (spotID, startTime, endTime) => {
  const duration = (endTime - startTime) / 3600;
  const spot = await db.collection('Spots').doc(spotID).get();
  const basePrice = spot.data().basePrice;
  // assuming based on hours
  let regularPrice = basePrice * duration;
  let surgedPrice;
  const surging = spot.data().demandPricing || false
  if (surging) {
    const postcode = spot.data().postcode
    const street = spot.data().streetName
    const spotsWithSamePostcode = await db.collection('Spots').where('postcode', '==', postcode).get()
    const spotsOnSameStreet = await db.collection('Spots').where('streetName', '==', street).get()
    const idChecklist = spotsOnSameStreet.docs.map(spot => spot.id)
    let surgingFactor = 0
    let countSpot = 0
    await Promise.all(spotsWithSamePostcode.docs.map(async (spot) => {
      const isAvailable = await checkSpotAvalaibility(spot.id, startTime, endTime)
      countSpot += 1
      if (!isAvailable) {
        // more expensive when more spots are occupied in that postcode area when booking
        surgingFactor += 0.5
        if (idChecklist.includes(spot.id)) {
          // even more expensive when the spot is on the same street
          surgingFactor += 0.3
        }
      }
    }));
    surgedPrice = regularPrice * (1 + surgingFactor / countSpot)
  } else {
    surgedPrice = regularPrice
  }
  regularPrice = parseFloat(regularPrice.toFixed(2));
  surgedPrice = parseFloat(surgedPrice.toFixed(2));
  return [regularPrice, surgedPrice]
}

const getSpotWithSamePostCode = async (spotID) => {
  const thisSpot = await db.collection('Spots').doc(spotID).get();
  const spotList = []
  const spotsWithSamePostcode = await db.collection('Spots').where('postcode', '==', thisSpot.data().postcode).get()
  spotsWithSamePostcode.forEach(spot => {
    if (spot.id.toString() !== spotID && spot.data().demandPricing === false) {
      spotList.push(spot)
    }
  })
  return spotList
}

// Note this is queried spot object, not spot id
const isInDemand = async (spot, startTime, endTime) => {
  let occupied = false;
  const postcode = spot.data().postcode
  const spotsWithSamePostcode = await db.collection('Spots').where('postcode', '==', postcode).get()
  let countBookedSpot = 0
  let countSpot = 0
  await Promise.all(spotsWithSamePostcode.docs.map(async (s) => {
    const isAvailable = await checkSpotAvalaibility(s.id, startTime, endTime)
    countSpot += 1
    if (!isAvailable) {
      countBookedSpot += 1
      if (s.id === spot.id) {
        occupied = true
      }
    }
  }));
  const inDemand = !!(((countBookedSpot / countSpot) >= 0.5 && !occupied))
  return inDemand
}

const pushNotification = async (spotID, startTime, endTime) => {
  const checkList = await getSpotWithSamePostCode(spotID)
  await Promise.all(checkList.map(async (spot) => {
    if (await isInDemand(spot, startTime, endTime)) {
      const noteData = {
        spotID: spot.id,
        postcode: spot.data().postcode,
        owner: spot.data().owner,
        time: Math.floor(Date.now() / 1000),
        text: 'Your spot is in high demand. Turn on surging price!',
        viewed: false
      }
      const newNotification = await db.collection('Notifications').add(noteData)
      console.log(`A new notification ${newNotification.id} has been added to the database`)
    }
  }))
}

const confirmNewBooking = async (spotID, userID, startTime, endTime, cardNumber, cardName, cardCvv) => {
  try {
    const spotExist = await checkSpotExist(spotID);
    const spotAvailable = await checkSpotAvalaibility(spotID, startTime, endTime);
    if (!spotExist) {
      console.log(`Booking Failed: Spot ${spotID} not found`)
      return {
        status: 404,
        error: 'Spot does not exist'
      }
    } else if (!spotAvailable) {
      console.log(`Booking Failed: Spot ${spotID} is not availble`)
      return {
        status: 409,
        error: 'Spot is not availble'
      }
    } else {
      const ownerID = (await db.collection('Spots').doc(spotID).get()).data().owner
      const currentTime = Math.floor(Date.now() / 1000)
      // if demandPricing is set as false, surgedPrice will just be the same as regualrPrice
      const [regularPrice, surgedPrice] = await calculatePrice(spotID, startTime, endTime)
      const data = {
        spotID,
        userID,
        ownerID,
        startTime,
        endTime,
        cardNumber,
        cardName,
        cardCvv,
        rating: null,
        review: null,
        bookingTime: currentTime,
        price: surgedPrice
      }

      const newBooking = await db.collection('Bookings').add(data)
      const bid = newBooking.id
      await pushNotification(spotID, startTime, endTime)

      console.log('New Booking added to database');
      return {
        status: 201,
        id: bid,
        message: 'New Booking confirmed'
      };
    }
  } catch (error) {
    console.error('Error confirming Booking:', error);
    return {
      status: 500,
      message: 'Booking confirmation FAILED',
      error: error.message
    };
  }
};

const getPriceForBooking = async (spotID, startTime, endTime) => {
  try {
    const spotExist = await checkSpotExist(spotID);
    const spotAvailable = await checkSpotAvalaibility(spotID, startTime, endTime);
    if (!spotExist) {
      console.log(`Price check Failed: Spot ${spotID} not found`)
      return {
        status: 404,
        error: 'Spot does not exist'
      }
    } else if (!spotAvailable) {
      console.log(`Price check Failed: Spot ${spotID} is not availble`)
      return {
        status: 409,
        error: 'Spot is not availble'
      }
    } else {
      const [regularPrice, surgedPrice] = await calculatePrice(spotID, startTime, endTime)
      console.log('Price retrived successfully');
      return {
        status: 200,
        regularPrice,
        surgedPrice,
        message: `Price for spot ${spotID} from ${startTime} to ${endTime} retrieved!`
      };
    }
  } catch (error) {
    console.error('Error getting Price:', error);
    return {
      status: 500,
      message: 'Price retrieval FAILED',
      error: error.message
    };
  }
};

const calculateRefundAvailability = (startTime) => {
  let refundAvailable;
  const currentTime = Math.floor(Date.now() / 1000)
  const hourRemained = (startTime - currentTime) / 3600
  if (hourRemained > 72) {
    refundAvailable = 1
  } else if (hourRemained > 24) {
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
        error: 'Booking not found'
      }
    } else {
      const data = booking.data();
      const refundAvailable = calculateRefundAvailability(data.startTime);
      console.log('Booking retrived successfully');
      return {
        status: 200,
        spotID: data.spotID,
        userID: data.userID,
        ownerID: data.ownerID,
        startTime: data.startTime,
        endTime: data.endTime,
        price: data.price,
        refundAvailable, // 0 for not available, 1 for 100%, 0.5 for 50%
        rating: data.rating,
        review: data.review,
        message: `booking ${bookingID} retrieved successfully`
      };
      // it is more common to nest all those fields in the response, so as to seperate the data and hyper-info,
      // but i will keep it like this to match the format as in dummy request
    }
  } catch (error) {
    console.error('Error getting Booking:', error);
    return {
      status: 500,
      message: 'Booking retrieval FAILED',
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
        error: 'Booking not found'
      }
    } else {
      if (rating) {
        await bookingRef.update({ rating })
      }
      if (review) {
        await bookingRef.update({ review })
      }
      console.log('Review updated successfully');
      return {
        status: 200,
        bid: bookingRef.id,
        message: 'Review added or updated successfully'
      };
    }
  } catch (error) {
    console.error('Error updating Review:', error);
    return {
      status: 500,
      message: 'Review update FAILED',
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
        error: 'Booking not found'
      }
    } else {
      await bookingRef.delete()
      console.log('Booking deletion successfully');
      return {
        status: 200,
        bid: bookingRef.id,
        message: 'Booking deleted successfully'
      };
    }
  } catch (error) {
    console.error('Error deleting Booking:', error);
    return {
      status: 500,
      message: 'Booking deletion FAILED',
      error: error.message
    };
  }
};

const getUpcomingBooking = async (userID) => {
  try {
    const asOwner = [];
    const asRenter = [];
    const currentTime = Math.floor(Date.now() / 1000)
    const ownerBookings = await db.collection('Bookings').where('ownerID', '==', userID).where('endTime', '>', currentTime).get()
    const renterBookings = await db.collection('Bookings').where('userID', '==', userID).where('endTime', '>', currentTime).get()
    ownerBookings.forEach(booking => asOwner.push(booking.id))
    renterBookings.forEach(booking => asRenter.push(booking.id))
    return {
      status: 200,
      asOwner,
      asRenter,
      message: 'Upcoming bookings retrieved successfully'
    }
  } catch (error) {
    console.error('Error retriving Booking:', error);
    return {
      status: 500,
      message: 'Booking retrival FAILED',
      error: error.message
    };
  }
};

const getHistoryBooking = async (userID) => {
  try {
    const asOwner = [];
    const asRenter = [];
    const currentTime = Math.floor(Date.now() / 1000)
    const ownerBookings = await db.collection('Bookings').where('ownerID', '==', userID).where('endTime', '<=', currentTime).get()
    const renterBookings = await db.collection('Bookings').where('userID', '==', userID).where('endTime', '<=', currentTime).get()
    ownerBookings.forEach(booking => asOwner.push(booking.id))
    renterBookings.forEach(booking => asRenter.push(booking.id))
    return {
      status: 200,
      asOwner,
      asRenter,
      message: 'Historical bookings retrieved successfully'
    }
  } catch (error) {
    console.error('Error retriving Booking:', error);
    return {
      status: 500,
      message: 'Booking retrival FAILED',
      error: error.message
    };
  }
};

const getAllBooking = async (userID) => {
  try {
    const asOwner = [];
    const asRenter = [];
    const ownerBookings = await db.collection('Bookings').where('ownerID', '==', userID).get()
    const renterBookings = await db.collection('Bookings').where('userID', '==', userID).get()
    ownerBookings.forEach(booking => asOwner.push(booking.id))
    renterBookings.forEach(booking => asRenter.push(booking.id))
    return {
      status: 200,
      asOwner,
      asRenter,
      message: 'All bookings of retrieved successfully'
    }
  } catch (error) {
    console.error('Error retriving Booking:', error);
    return {
      status: 500,
      message: 'Booking retrival FAILED',
      error: error.message
    };
  }
};

export { confirmNewBooking, getPriceForBooking, getBooking, updateReview, deleteBooking };
export { getUpcomingBooking, getHistoryBooking, getAllBooking };
