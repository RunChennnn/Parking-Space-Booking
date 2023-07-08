import React from "react"
import { Button, Card, Typography } from "@mui/material"

function SearchStub (props) {

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
  }

  const buttonStyle = {
    margin: 'auto',
    width: '100px',
    height: '36.5px',
  }
    
  return (
    <Card key={props.spotID} style={cardStyle}>
      <div>
        <Typography variant='h6'>Address: (address for ID {props.spotID})</Typography>
        <Typography>Average price per hour: (price for ID {props.spotID})</Typography>
      </div>
      <Button id={`view-${props.spotID}-button`} variant='contained' style={buttonStyle}>View</Button>
      
    </Card>
  )
}

export default SearchStub