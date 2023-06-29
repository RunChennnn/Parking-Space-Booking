import React from "react"
import { Alert, Button, Card, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';

const pageStyle = {
  display: 'grid',
  gridTemplateColumns: '52vw 32vw',
  columnGap: '6vw',
  padding: '10vh 5vw 0 5vw',
};

const cardStyle = {
  margin: '0',
  padding: '5%',
  backgroundColor: '#f8f8f8',
  borderColor: '#aaa',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  rowGap: '15px'
};

const buttonStyle = {
  margin: '20px auto 0 auto',
  width: '150px'
};

const inputStyle = {
  backgroundColor: '#fff',
  margin: '0',
  padding: '0'
};

const errorStyle = {
  marginTop: '10px',
};

function Register () {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
    
  const navigate = useNavigate();

  function validPassword () {

    // Unmatched passwords
    if (password !== confirmPassword) {
      setErrorMessage('Please ensure passwords match and try again.');
      setShowError(true)
      return false;
    }

    return true;
  }

  async function pressRegister () {

    // Check passwords equal
    if (!validPassword()) {
      return;
    }
    
    const request = {
      email,
      password
    };
    const response = await makeRequest("POST", "auth/register", request);
    if (response.error) {
      if (response.error === 'Firebase: Error (auth/email-already-in-use).') {
        setErrorMessage('This email address is already used for an account. Please select a different email address and try again.');
        setShowError(true)
      } else if (response.error === 'Weak Password') {
        setErrorMessage('Please choose a longer password and try again. Passwords must contain at least 8 characters, and contain at least 2 of the following: lowercase characters, uppercase characters, numbers.');
        setShowError(true)
      } else if (response.error === 'Firebase: Error (auth/invalid-email).') {
        setErrorMessage('Please choose a valid email address.');
        setShowError(true)
      } else {
        console.log(`Unknown error: ${response.error}`);
      }
    } else {
      // Correct credentials, so log in
      localStorage.setItem('vroom-token', response.token);
      localStorage.setItem('vroom-id', response.userID);
      navigate("/home");
    }
  }

  function pressLogin () {
    navigate("/login")
  }

  return (
    <>

      <div style={pageStyle}>
        <Card style={cardStyle}>
          <TextField variant='outlined' size='small' label='Email' placeholder="example@email.com" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
          <TextField variant='outlined' size='small' type='password' label='Password' style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
          <TextField variant='outlined' size='small' type='password' label='Confirm Password' style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
          <Button variant="contained" style={buttonStyle} onClick={pressRegister}>Register</Button>
        </Card>
        <Card style={cardStyle}>
        <Typography align='center' variant='h5'>
          Already have an account?
        </Typography>
        <Button variant="contained" style={buttonStyle} onClick={pressLogin}>Login</Button>
        </Card>
        {showError && (<Alert severity="error" style={errorStyle}>{errorMessage}</Alert>)}
      </div>
    </>
  )
}

export default Register