import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useNavigate, useParams } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import { Typography } from '@mui/material';
import BookingStub from '../components/BookingStub';

function BookingHistory () {
  const params = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = React.useState(false);
  const [bookingArray, setBookingArray] = React.useState([])

  const spacerStyle = {
    height: '20px',
  }

  React.useEffect(() => {
    async function getData () {
      // Get all booking IDs
      const initialResponse = await makeRequest('GET', `history/${params.userID}`);
      const bookingIDs = initialResponse.asOwner.concat(initialResponse.asRenter);
      console.log(bookingIDs);

      // Get details of all bookings
      // const bookings = [];
      // for (const id of bookingIDs) {
      //   const booking = await makeRequest('GET', `booking/${id}`);
      //   const spot = await makeRequest('')
      //   bookings.push(response);
      // }
      const bookings = await Promise.all(bookingIDs.map(async (id) => {
        const booking = await makeRequest('GET', `booking/${id}`);
        const spot = await makeRequest('GET', `spot/${booking.spotID}`);
        if (spot.data.owner === params.userID) {
          booking.doView = () => navigate(`/booking/view/${id}`);
        } else {
          booking.doView = () => navigate(`/booking/review/${id}`);
        }
        booking.spot = spot;
        booking.id = id;
        booking.currentUserID = params.userID;
        return booking;
      }));
      bookings.sort((a, b) => b.startTime - a.startTime);
      setBookingArray(bookings.map((elem) => {
        return BookingStub(elem);
      }))
      setLoaded(true);
    }
    getData();
    setLoaded(false);
  }, [])

  return (
    <>
      <NavigationBar />
      <div style={spacerStyle} />
      {!loaded && (<Typography align='center' variant='h6'>Loading bookings...</Typography>)}
      {loaded && (bookingArray.length > 0) && (<Typography align='center' variant='h3'>Booking History</Typography>)}
      {loaded && (bookingArray.length === 0) && (<Typography align='center' variant='h6'>No previous bookings to show</Typography>)}
      {bookingArray}
    </>
  )
}

export default BookingHistory
