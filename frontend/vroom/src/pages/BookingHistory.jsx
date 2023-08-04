import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useNavigate, useParams } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import { Button, Typography } from '@mui/material';
import BookingStub from '../components/BookingStub';
import { adminIsLoggedIn } from '../utilities/admin';

function BookingHistory () {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [bookingArray, setBookingArray] = React.useState([])

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const spacerStyle = {
    height: '20px',
  }

  const buttonStyle = {
    margin: '12px',
    width: '200px',
    marginLeft: 'calc(50% - 100px)',
  };

  React.useEffect(() => {
    async function getData () {
      const initialResponse = adminIsLoggedIn() ? await makeRequest('GET', 'admin/history', {}) : await makeRequest('GET', `history/${params.userID}`);
      const bookingIDs = adminIsLoggedIn() ? initialResponse.bookingIDs : initialResponse.asOwner.concat(initialResponse.asRenter);
      const bookings = await Promise.all(bookingIDs.map(async (id) => {
        try {
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
        } catch (error) {
          // Doesn't have a spot or user, so skip it
        }
      }));
      bookings.sort((a, b) => b.startTime - a.startTime);
      setBookingArray(bookings.map((elem) => {
        try {
          return BookingStub(elem);
        } catch (error) {
          // Doesn't have a spot or user, so skip it
          return <></>
        }
      }))
      setLoading(false);
    }
    getData();
  }, [])

  function pressViewUpcoming () {
    navigate(`/account/${params.userID}`);
  }

  return (
    <>
      <NavigationBar loading={loading} />
      <div style={spacerStyle} />
      {adminIsLoggedIn() && (<Button id='view-upcoming-button' variant="contained" style={buttonStyle} onClick={pressViewUpcoming}>View Upcoming</Button>)}
      {!loading && (bookingArray.length > 0) && (<Typography align='center' variant='h3'>Booking History</Typography>)}
      {!loading && (bookingArray.length === 0) && (<Typography align='center' variant='h6'>No previous bookings to show</Typography>)}
      {bookingArray}
    </>
  )
}

export default BookingHistory
