import React from 'react'
import { Button, Card, Typography } from '@mui/material'

function BookingStub (props) {
  function isOwner () {
    if (props.currentUserID === props.ownerID) { return true }
    if (localStorage.getItem('vroom-id') === props.ownerID) { return true }
    return false;
  }
  const cardStyle = {
    width: 'calc(100% - 130px)',
    margin: '20px 50px',
    padding: '15px',
    backgroundColor: isOwner() ? '#ffefa8' : '#f8f8f8',
    borderColor: isOwner() ? '#f7ae02' : '#aaa',
    borderStyle: 'solid',
    borderWidth: isOwner() ? '2px' : '1px',
    borderRadius: '10px',
    display: 'grid',
    gridTemplateColumns: 'calc(100% - 150px) 150px',
  };

  const buttonStyle = {
    margin: 'auto',
    width: '150px',
    height: '36.5px',
  };
  const spot = props.spot.data;
  const address = `${spot.streetNumber} ${spot.streetName} ${spot.suburb} ${spot.postcode}`;

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const start = new Date(props.startTime * 1000).toLocaleDateString('en-UK', options);
  const end = new Date(props.endTime * 1000).toLocaleDateString('en-UK', options);

  let date = '';
  if (start === end) {
    date = start;
  } else {
    date = `${start} to ${end}`
  }

  return (
    <Card key={props.id} style={cardStyle}>
      <div>
        <Typography variant='h6'>{address} {isOwner() && '(as owner)'}</Typography>
        <Typography>{date}</Typography>
      </div>
      <Button id={`view-${props.spotID}-button`} variant='contained' style={buttonStyle} onClick={props.doView}>View Booking</Button>

    </Card>
  )
}

export default BookingStub
