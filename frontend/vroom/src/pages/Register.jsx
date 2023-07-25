import React from 'react'
import { Alert, Button, Card, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { client } from '../utilities/firebaseConfig';
import { getAuth, getIdToken, createUserWithEmailAndPassword } from 'firebase/auth';

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

  function checkPassword (pwdstr) {
    const hasUppercase = /[A-Z]/.test(pwdstr) ? 1 : 0;
    const hasLowercase = /[a-z]/.test(pwdstr) ? 1 : 0;
    const hasNumbers = /\d/.test(pwdstr) ? 1 : 0;

    const hasCount = hasUppercase + hasLowercase + hasNumbers;
    return (pwdstr.length >= 8 && hasCount >= 2);
  }

  function validPassword () {
    // Unmatched passwords
    if (password !== confirmPassword) {
      setErrorMessage('Please ensure passwords match and try again.');
      setShowError(true)
      return false;
    }

    if (!checkPassword(password)) {
      setErrorMessage('Please choose a different password and try again. Passwords must contain at least 8 characters, and contain at least 2 of the following: lowercase characters, uppercase characters, numbers.')
      setShowError(true);
      return false;
    }
    return true;
  }

  async function pressRegister () {
    // Check passwords valid
    if (!validPassword()) { return; }

    try {
      const clientAuth = getAuth(client);
      const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
      const token = await getIdToken(userCredential.user);

      localStorage.setItem('vroom-token', token);
      localStorage.setItem('vroom-id', userCredential.user.uid);
      localStorage.setItem('vroom-admin', false) // won't be admin if we're making a new account
      navigate('/home');
    } catch (error) {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).' || error.message === 'The email address is already in use by another account.') {
        setErrorMessage('This email address is already used for an account. Please select a different email address and try again.');
        setShowError(true)
      } else if (error.message === 'Firebase: Error (auth/invalid-email).' || error.message === 'The email address is improperly formatted.') {
        setErrorMessage('Please choose a valid email address.');
        setShowError(true)
      } else {
        console.log(`Unknown error: ${error.message}`);
        setErrorMessage(error.message)
        setShowError(true);
      }
    }
  }

  function pressLogin () {
    navigate('/login')
  }

  return (
    <>

      <div style={pageStyle}>
        <Card style={cardStyle}>
          <TextField id='email-input' variant='outlined' size='small' label='Email' placeholder="example@email.com" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
          <TextField id='password-input' variant='outlined' size='small' type='password' label='Password' style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
          <TextField id='confirm-password-input' variant='outlined' size='small' type='password' label='Confirm Password' style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
          <Button id='register-button' variant="contained" style={buttonStyle} onClick={pressRegister}>Register</Button>
        </Card>
        <Card style={cardStyle}>
        <Typography align='center' variant='h5'>
          Already have an account?
        </Typography>
        <Button id='login-button' variant="contained" style={buttonStyle} onClick={pressLogin}>Login</Button>
        </Card>
        {showError && (<Alert severity="error" style={errorStyle}>{errorMessage}</Alert>)}
      </div>
    </>
  )
}

export default Register
