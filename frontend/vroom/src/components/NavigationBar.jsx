import React from 'react'
import { Button, LinearProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { adminIsLoggedIn, userIsLoggedIn, doLogout } from '../utilities/admin';

function NavigationBar (props) {
  const navigate = useNavigate();

  const height = '60px';

  const barStyle = {
    backgroundColor: '#ddd',
    width: '100vw',
    height,
    position: 'fixed',
    top: 0,
    left: 0,
    borderBottomColor: '#aaa',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    zIndex: 100,
  };

  const spacerStyle = {
    width: '100vw',
    height,
  };

  const buttonStyle = {
    margin: '12px',
    // width: '100px',
  };

  const loadingStyle = {
    margin: '-2px',
    zIndex: 200,
  }

  function pressManageParkingSpots () {
    if (localStorage.getItem('vroom-token')) {
      navigate(`/spots/${localStorage.getItem('vroom-id')}`);
    } else {
      navigate('/login');
    }
  }

  function pressMyAccount () {
    if (localStorage.getItem('vroom-token')) {
      navigate(`/account/${localStorage.getItem('vroom-id')}`);
    } else {
      navigate('/login');
    }
  }

  function pressAllUsers () {
    navigate('/users');
  }

  function pressLogout () {
    doLogout();
    navigate('/login');
  }

  function pressLogin () {
    navigate('/login');
  }

  function pressNotifications () {
    navigate(`/account/${localStorage.getItem('vroom-id')}/notifications`)
  }

  return (
    <>
      <div style={spacerStyle}></div>
      {adminIsLoggedIn() && (
        <div style={barStyle}>
          <Button id='nav-home-button' variant="contained" style={buttonStyle} onClick={() => navigate('/home')}>Home</Button>
          <Button id='nav-all-spots-button' variant="contained" style={buttonStyle} onClick={pressManageParkingSpots}>All Parking Spots</Button>
          <Button id='nav-all-bookings-button' variant="contained" style={buttonStyle} onClick={pressMyAccount}>All Bookings</Button>
          <Button id='nav-all-users-button' variant="contained" style={buttonStyle} onClick={pressAllUsers}>All Users</Button>
          <Button id='nav-logout-button' variant="contained" color="error" style={buttonStyle} onClick={pressLogout}>Logout</Button>
          {props.loading && (<LinearProgress style={loadingStyle} />)}
        </div>
      )}
      {!adminIsLoggedIn() && userIsLoggedIn() && (
        <div style={barStyle}>
          <Button id='nav-home-button' variant="contained" style={buttonStyle} onClick={() => navigate('/home')}>Home</Button>
          <Button id='nav-manage-spots-button' variant="contained" style={buttonStyle} onClick={pressManageParkingSpots}>Manage Parking Spots</Button>
          <Button id='nav-my-account-button' variant="contained" style={buttonStyle} onClick={pressMyAccount}>My Account</Button>
          <Button id='nav-notifications-button' variant="contained" style={buttonStyle} onClick={pressNotifications}>Notifications</Button>
          <Button id='nav-logout-button' variant="contained" color="error" style={buttonStyle} onClick={pressLogout}>Logout</Button>
          {props.loading && (<LinearProgress style={loadingStyle} />)}
        </div>
      )}
      {!userIsLoggedIn() && (
        <div style={barStyle}>
          <Button id='nav-home-button' variant="contained" style={buttonStyle} onClick={() => navigate('/home')}>Home</Button>
          <Button id='nav-logout-button' variant="contained" color="success" style={buttonStyle} onClick={pressLogin}>Login</Button>
          {props.loading && (<LinearProgress style={loadingStyle} />)}
        </div>
      )}
    </>
  )
}

export default NavigationBar
