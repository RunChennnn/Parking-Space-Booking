import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import makeRequest from '../utilities/makeRequest';
import { Button, Typography } from '@mui/material';
import AccountDetailRow from '../components/AccountDetailRow';
import BookingStub from '../components/BookingStub';
import { adminIsLoggedIn } from '../utilities/admin';

function MyAccount () {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const params = useParams();

  const [email, setEmail] = React.useState('');
  const [bookings, setBookings] = React.useState([]);

  const buttonRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '20px auto',
  };

  const buttonStyle = {
    margin: '12px',
    width: '200px',
  };

  const adminButtonStyle = {
    margin: '12px',
    width: '200px',
    marginLeft: 'calc(50% - 100px)',
  };

  React.useEffect(() => {
    async function getData () {
      const response = await makeRequest('GET', `user/${params.userID}/basic`, {});
      setEmail(response.email);
    }

    async function getBookings () {
      const response = adminIsLoggedIn() ? await makeRequest('GET', 'admin/upcoming', {}) : await makeRequest('GET', `user/${params.userID}`, {});
      const upcoming = adminIsLoggedIn() ? response.bookingIDs : response.upcoming;
      // console.log(response);

      const tmp = await Promise.all(upcoming.map(async (id) => {
        const booking = await makeRequest('GET', `booking/${id}`);
        const spot = await makeRequest('GET', `spot/${booking.spotID}`);
        booking.doView = () => navigate(`/booking/upcoming/${id}`);
        booking.spot = spot;
        booking.id = id;
        return booking;
      }));
      // setBookings(tmp);
      setBookings(tmp.map((elem) => {
        return BookingStub(elem);
      }))
      setLoading(false);
    }
    getData();
    getBookings();
  }, [])

  function pressUpdateAccount () {
    navigate(`/account/${params.userID}/update`);
  }

  function pressViewHistory () {
    navigate(`/history/${params.userID}`);
  }

  return (
    <>
      <NavigationBar loading={loading} />
      <div style={{ height: '20px' }}></div>
      {!adminIsLoggedIn() && (
        <>
          <AccountDetailRow head='Email:' body={email} />
          <div style={buttonRowStyle}>
            <Button id='update-account-button' variant="contained" style={buttonStyle} onClick={pressUpdateAccount}>Update Account</Button>
            <Button id='view-history-button' variant="contained" style={buttonStyle} onClick={pressViewHistory}>View History</Button>
          </div>
        </>
      )}
      {adminIsLoggedIn() && (<Button id='view-history-button' variant="contained" style={adminButtonStyle} onClick={pressViewHistory}>View History</Button>)}
      {(bookings.length === 0 && !loading) && (<Typography variant='h6' align='center'>No Upcoming Bookings</Typography>)}
      {(bookings.length > 0 || loading) && (<Typography variant='h3' align='center'>Upcoming Bookings</Typography>)}
      {bookings}
    </>
  )
}

export default MyAccount
