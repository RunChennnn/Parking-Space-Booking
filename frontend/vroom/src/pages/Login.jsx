import React from 'react'
import { Alert, Button, Card, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { client } from '../utilities/firebaseConfig';
import { getAuth, getIdToken, signInWithEmailAndPassword } from 'firebase/auth';
import { doLogin } from '../utilities/admin';

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

function Login () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  const navigate = useNavigate();

  async function pressLogin () {
    setShowError(false);
    try {
      const clientAuth = getAuth(client);
      const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
      const token = await getIdToken(userCredential.user);

      await doLogin(userCredential.user.uid, token);
      navigate('/home');
    } catch (error) {
      if (
        error.message === 'Firebase: Error (auth/wrong-password).' ||
        error.message === 'Firebase: Error (auth/user-not-found).' ||
        error.message === 'Firebase: Error (auth/invalid-email).'
      ) {
        setShowError(true)
        setErrorText('Invalid username or password, please try again.');
      } else if (error.message === 'Firebase: Error (auth/missing-password).') {
        setShowError(true)
        setErrorText('Please enter a password and try again.');
      } else if (error.message === 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).') {
        setShowError(true)
        setErrorText('Too many failed login attempts. Please try again later.');
      } else {
        console.log(`Unknown error: ${error.message}`);
      }
    }
  }

  function pressRegister () {
    navigate('/register')
  }

  return (
    <>

      <div style={pageStyle}>
        <Card style={cardStyle}>
          <TextField id='email-input' variant='outlined' size='small' label='Email' placeholder="example@email.com" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
          <TextField id='password-input' variant='outlined' size='small' type='password' label='Password' style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
          <Button id='login-button' variant="contained" style={buttonStyle} onClick={pressLogin}>Login</Button>
        </Card>
        <Card style={cardStyle}>
        <Typography align='center' variant='h5'>
          Don&apos;t have an account?
        </Typography>
        <Button id='register-button' variant="contained" style={buttonStyle} onClick={pressRegister}>Register</Button>
        </Card>
        {showError && (<Alert severity="error" style={errorStyle}>{errorText}</Alert>)}
      </div>
    </>
  )
}

export default Login
