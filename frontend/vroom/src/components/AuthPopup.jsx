import React from "react";
import { Alert, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import makeRequest from "../utilities/makeRequest";

function AuthPopup (props) {

  const [password, setPassword] = React.useState('');
  const [showError, setShowError] = React.useState(false);

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
    const preresponse = await makeRequest('GET', `user/${params.userID}`, {});
    const response = await makeRequest('POST', `auth/${localStorage.getItem('vroom-id')}`, { email: preresponse.email, password: password });
    if (!response.error) {
      props.onConfirm();
    } else {
      setShowError(true);
    }
  };

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
          <TextField style={textFieldStyle} size='small' type='password' label='Current Password' autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        {showError && (<Alert severity="error" style={errorStyle}>Incorrect password, please try again.</Alert>)}
        <DialogActions>
          <Button variant="outlined" onClick={onBack}>Back</Button>
          <Button variant="contained" onClick={onConfirm}>Confirm</Button>
        </DialogActions>
        
      </Dialog>
    </>
  )
}

export default AuthPopup