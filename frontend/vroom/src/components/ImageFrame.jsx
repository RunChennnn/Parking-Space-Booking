/* eslint-disable */
import React from 'react';
import { Avatar, Typography } from '@mui/material';

function ImageFrame (props) {
  if (!props.size) { props.size = 100; }

  const style = {
    width: `${props.size}px`,
    height: `${props.size}px`,
    margin: `0px calc(50% - ${props.size / 2}px)`,
  }

  return (
    <Avatar style={style} src={props.image} />
  )
}

export default ImageFrame;
