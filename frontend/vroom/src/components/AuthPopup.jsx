import React from 'react';
import { Alert, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import makeRequest from '../utilities/makeRequest';

function AuthPopup (props) {
  const [password, setPassword] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const textFieldStyle = {
    width: '100%',
    backgroundColor: '#fff',
    margin: '20px 0 0 0',
    padding: '0'
  }

  const errorStyle = {
    margin: '5px 24px',
    padding: '0 10px',
  };

  async function onConfirm () {
    setLoading(true);
    setShowError(false);
    const preresponse = await makeRequest('GET', `user/${localStorage.getItem('vroom-id')}/basic`, {});
    const response = await makeRequest('POST', `auth/${localStorage.getItem('vroom-id')}`, { email: preresponse.email, password });
    if (!response.error) {
      await props.onConfirm();
    } else {
      setShowError(true);
    }
    setLoading(false);
  }

  function onBack () {
    setShowError(false);
    setPassword('');
    props.onBack()
  }

  return (
    <>
      <Dialog open={props.show}>
        <DialogTitle>
          Authentication required
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please input your password below to confirm your request.
          </DialogContentText>
          <TextField id='auth-password-input' style={textFieldStyle} size='small' type='password' label='Current Password' autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        {showError && (<Alert severity="error" style={errorStyle}>Incorrect password, please try again.</Alert>)}
        <DialogActions>
          {loading && (<CircularProgress style={{ marginRight: '10px' }} />)}
          <Button id='auth-back-button' variant="outlined" onClick={onBack}>Back</Button>
          <Button id='auth-confirm-button' variant="contained" onClick={onConfirm}>Confirm</Button>
        </DialogActions>

      </Dialog>
    </>
  )
}

export default AuthPopup
