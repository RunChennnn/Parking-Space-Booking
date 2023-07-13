import React from "react"
import { useParams } from 'react-router-dom'
import NavigationBar from "./NavigationBar"
import makeRequest from "../utilities/makeRequest";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountDetailRow from "./AccountDetailRow";

function MyAccount () {

  const navigate = useNavigate();

  const params = useParams();

  const [email, setEmail] = React.useState('');

  const buttonRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '20px auto',
  };

  const buttonStyle = {
    margin: '12px',
    width: '200px',
  };

  // const detailWrapperStyle = {
  //   display: 'grid',
  //   gridTemplateColumns: '20vw 30vw',
  // };

  // const detailStyleLeft = {
  //   color: 'blue',
  // };

  // const detailStyleRight = {
  //   color: 'red'
  // };

  React.useEffect(() => {
    async function getData () {
      const response = await makeRequest('GET', `user/${params.userID}`, {});
      setEmail(response.email);
    }
    getData();
  }, [])

  function pressUpdateAccount () {
    navigate(`/account/${params.userID}/update`);
  }

  function pressViewHistory () {
    console.log('Not yet implemented');
    // navigate(`account/${params.userID}/update`);
  }
  
  return (
    <>  
      <NavigationBar />
      <div style={{ height: '30px' }}></div>
      <AccountDetailRow head='Email:' body={email} />
      <div style={buttonRowStyle}>
        <Button id='update-account-button' variant="contained" style={buttonStyle} onClick={pressUpdateAccount}>Update Account</Button>
        <Button id='view-history-button' variant="contained" style={buttonStyle} onClick={pressViewHistory}>View History</Button>
      </div>
      <Typography variant='h3' align='center'>Upcoming Bookings</Typography>
      TODO render bookings as individual components
    </>
  )
}

export default MyAccount