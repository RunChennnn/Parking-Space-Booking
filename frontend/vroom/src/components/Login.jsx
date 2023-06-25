import React from "react"
import { Alert, Button, Card, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';

function Login () {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: '42vw 42vw',
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
    margin: '20px 30% 0 30%'
  };

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  };

  const errorStyle = {
    marginTop: '10px',
  };
    
  const navigate = useNavigate();

  async function pressLogin () {
    const request = {
      email,
      password
    };
    const response = await makeRequest("POST", "auth/login", request);
    if (response.error) {
      if (response.error === 'invalid username or password') {
        setShowError(true)
        console.log("Invalid username or password");
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

  function pressRegister () {
    navigate("/register")
  }

  return (
    <>

      <div style={pageStyle}>
        <Card style={cardStyle}>
          <TextField variant='outlined' size='small' label='Email' placeholder="example@email.com" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
          <TextField variant='outlined' size='small' type='password' label='Password' style={inputStyle} valie={password} onChange={(e) => setPassword(e.target.value)}></TextField>
          <Button variant="contained" style={buttonStyle} onClick={pressLogin}>Login</Button>
        </Card>
        <Card style={cardStyle}>
        <Typography align='center' variant='h5'>
          Don't have an account?
        </Typography>
        <Button variant="contained" style={buttonStyle} onClick={pressRegister}>Register</Button>
        </Card>
        {showError && (<Alert severity="error" style={errorStyle}>Invalid username or password, please try again.</Alert>)}
      </div>
    </>
  )
}

export default Login