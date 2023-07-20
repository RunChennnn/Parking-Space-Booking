import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import makeRequest from '../utilities/makeRequest';
import { Button, Typography } from '@mui/material';
import AccountDetailRow from './AccountDetailRow';
import BookingStub from './BookingStub';

function MyAccount () {
  const navigate = useNavigate();

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

  React.useEffect(() => {
    async function getData () {
      const response = await makeRequest('GET', `user/${params.userID}/basic`, {});
      setEmail(response.email);
    }

    async function getBookings () {
      const response = await makeRequest('GET', `user/${params.userID}`, {});
      console.log(response);

      const tmp = [];
      // Add upcoming bookings
      for (const bookingID of response.upcoming) {
        const prop = await makeRequest('GET', `booking/${bookingID}`, {});
        const spot = await makeRequest('GET', `spot/${prop.spotID}`, {});
        prop.doView = () => navigate(`/booking/upcoming/${bookingID}`);
        prop.id = bookingID;
        prop.spot = spot;
        tmp.push(BookingStub(prop));
      }
      setBookings(tmp);
    }
    getData();
    getBookings();
  }, [])

  function pressUpdateAccount () {
    navigate(`/account/${params.userID}/update`);
  }

  function pressViewHistory () {
    console.log('Not yet implemented');
    // navigate(`account/${params.userID}/update`);
  }

  return (
    <>
      <NavigationBar />
      <div style={{ height: '30px' }}></div>
      <AccountDetailRow head='Email:' body={email} />
      <div style={buttonRowStyle}>
        <Button id='update-account-button' variant="contained" style={buttonStyle} onClick={pressUpdateAccount}>Update Account</Button>
        <Button id='view-history-button' variant="contained" style={buttonStyle} onClick={pressViewHistory}>View History</Button>
      </div>
      {bookings.length === 0 && (<Typography variant='h6' align='center'>No Upcoming Bookings</Typography>)}
      {bookings.length > 0 && (<Typography variant='h3' align='center'>Upcoming Bookings</Typography>)}
      {bookings}
    </>
  )
}

export default MyAccount
