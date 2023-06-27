import React from "react";
import { Typography } from "@mui/material";

function AccountDetailRow (props) {

  const divStyle = {
    display: 'grid',
    gridTemplateColumns: '10vw 25vw',
    columnGap: '5vw',
    margin: '10px 25vw 10px 35vw'
  }

  const headStyle = {
    color: 'black',
  }

  const bodyStyle = {
    color: '#888',
  }

  return (
    <>
      <div style={divStyle}>
        <div style={headStyle}>
          <Typography>{props.head}</Typography>
        </div>
        <div style={bodyStyle}>
          <Typography>{props.body}</Typography>
        </div>
      </div>
    </>
  )
}

export default AccountDetailRow