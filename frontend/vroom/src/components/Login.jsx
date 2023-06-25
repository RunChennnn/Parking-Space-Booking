import React from "react"
import { Alert, Button, Card, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Login () {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: '42vw 42vw',
    columnGap: '6vw',
    padding: '10vh 5vw 0 5vw',
  };

  const cardStyle = {
    margin: '0',
    padding: '5%',
    backgroundColor: '#eee',
    borderColor: '#aaa',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    rowGap: '15px'
  }

  const buttonStyle = {
    margin: '20px 30% 0 30%'
  }

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  }
    
  const navigate = useNavigate();

  function pressLogin () {
    console.log(`Login with ${email}, ${password}`);
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
      </div>
    </>
  )
}

export default Login