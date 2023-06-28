import React from "react"
import { useParams } from 'react-router-dom'
import NavigationBar from "./NavigationBar"
import AuthPopup from "./AuthPopup"
import { Button, TextField, Typography } from "@mui/material"
import makeRequest from "../utilities/makeRequest"
import { useNavigate } from "react-router-dom"

function UpdateAccount () {

  const navigate = useNavigate();
  const params = useParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showUpdatePopup, setShowUpdatePopup] = React.useState(false);
  const [showDeletePopup, setShowDeletePopup] = React.useState(false);

  const instructionStyle = {
    marginTop: '30px',
    marginLeft: 'calc(25vw - 30px)',
    color: '#888',
    width: 'calc(50vw + 60px)'
  };

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  };

  const formStyle = {
    margin: '0',
    padding: '50px 10vw',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '25px',
  };

  const buttonRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '0 auto',
  };

  const buttonStyle = {
    margin: '12px',
    width: '200px',
  };


  function pressUpdate () {
    setShowUpdatePopup(true);
  }

  function pressDeleteAccount () {
    setShowDeletePopup(true);
  }

  async function doUpdate () {
    let request = {}
    if (email !== '') {
      request.email = email;
    }
    if (password !== '' && password === confirmPassword) {
      request.password = password;
    }

    console.log(request);

    await makeRequest('PATCH', `user/${params.userID}/update`, request);
    // console.log('Not implemented yet (not for sprint 1)');
    navigate(`/account/${params.userID}`)
  }

  async function doDelete () {
    await makeRequest('DELETE', `user/${params.userID}/delete`);
    navigate(`/`);
  }
  
  return (
    <>  
      <NavigationBar />
      <Typography style={instructionStyle} align='center'>
        Fill in any fields you'd like to change. If you leave any blank, they'll remain unchanged. You'll be prompted for your old password to make any changes.
      </Typography>
      <div style={formStyle}>
        <TextField variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='New Email' placeholder="example@email.com" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
        <TextField variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='New Password' type='password' style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
        <TextField variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='Confirm New Password' type='password' style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
      </div>
      <div style={buttonRowStyle}>
        <Button variant="contained" style={buttonStyle} onClick={pressUpdate}>Update</Button>
        <Button variant="contained" color='error' style={buttonStyle} onClick={pressDeleteAccount}>Delete Account</Button>
      </div>
      <AuthPopup show={showUpdatePopup} onConfirm={doUpdate} onBack={() => setShowUpdatePopup(false)} />
      <AuthPopup show={showDeletePopup} onConfirm={doDelete} onBack={() => setShowDeletePopup(false)} />
    </>
  )
}

export default UpdateAccount