import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

function NavigationBar () {
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

  function pressLogout () {
    localStorage.removeItem('vroom-token');
    localStorage.removeItem('vroom-id');
    navigate('/login');
  }

  return (
    <>
      <div style={spacerStyle}></div>
      <div style={barStyle}>
        <Button id='nav-home-button' variant="contained" style={buttonStyle} onClick={() => navigate('/home')}>Home</Button>
        <Button id='nav-manage-spots-button' variant="contained" style={buttonStyle} onClick={pressManageParkingSpots}>Manage Parking Spots</Button>
        <Button id='nav-my-account-button' variant="contained" style={buttonStyle} onClick={pressMyAccount}>My Account</Button>
        <Button id='nav-logout-button' variant="contained" color="error" style={buttonStyle} onClick={pressLogout}>Logout</Button>
      </div>
    </>
  )
}

export default NavigationBar
