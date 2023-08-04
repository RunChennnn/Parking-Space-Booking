import React from 'react'
import { Button, Card, Typography } from '@mui/material'

function Notification (props) {
  const cardStyle = {
    width: 'calc(100% - 130px)',
    margin: '20px 50px',
    padding: '15px',
    backgroundColor: !props.viewed ? '#ffefa8' : '#f8f8f8',
    borderColor: !props.viewed ? '#f7ae02' : '#aaa',
    borderStyle: 'solid',
    borderWidth: !props.viewed ? '2px' : '1px',
    borderRadius: '10px',
    display: 'grid',
    gridTemplateColumns: 'calc(100% - 150px) 150px',
  };

  const buttonStyle = {
    margin: 'auto',
    width: '150px',
    height: '36.5px',
  };

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  function doView () {
    props.doView();
    props.viewed = true;
  }

  const date = new Date(props.timestamp * 1000).toLocaleDateString('en-UK', options);

  return (
    <Card key={props.id} style={cardStyle}>
      <div>
        <Typography variant='h6'>{props.text}</Typography>
        <Typography>{date}</Typography>
      </div>
      {!props.viewed && <Button id={`view-${props.spotID}-button`} variant='contained' style={buttonStyle} onClick={doView}>Mark as Read</Button>}

    </Card>
  )
}

export default Notification
