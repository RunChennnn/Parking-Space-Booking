import React from 'react'
import { Button, Card, Typography } from '@mui/material'

function UserStub (props) {
  const cardStyle = {
    width: 'calc(100% - 130px)',
    margin: '20px 50px',
    padding: '15px',
    backgroundColor: '#f8f8f8',
    borderColor: '#aaa',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '10px',
    display: 'grid',
    gridTemplateColumns: 'calc(100% - 150px) 150px',
  };

  const buttonStyle = {
    margin: 'auto',
    width: '100px',
    height: '36.5px',
  };

  return (
    <Card key={props.id} style={cardStyle}>
      <div>
        <Typography variant='h6'>Email: {props.email}</Typography>
      </div>
      <Button id={`view-${props.id}-button`} variant='contained' style={buttonStyle} onClick={props.doView}>View</Button>
    </Card>
  )
}

export default UserStub
