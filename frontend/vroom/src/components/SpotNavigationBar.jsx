import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

function SpotNavigationBar () {
  const navigate = useNavigate()

  const barStyle = {
    backgroundColor: '#ffffff',
    width: 'fixed',
    height: '60px',
    position: 'fixed',
    top: 0,
    right: 0,
    borderBottomColor: '#ffffff',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px'
  };

  const spacerStyle = { width: 'fixed', height: '60px' }

  const buttonStyle = { margin: '12px' };

  function backToHome () { navigate('/home') }

  function logout () {
    localStorage.removeItem('vroom-token')
    localStorage.removeItem('vroom-id')
    navigate('/login')
  }

  return (
        <>
           <div style={spacerStyle}></div>
           <div style={barStyle}>
               <Button variant="contained" style={buttonStyle} onClick={backToHome}>Home</Button>
               <Button variant="contained" style={buttonStyle} onClick={logout}>Logout</Button>
           </div>
        </>
  )
}
export default SpotNavigationBar
