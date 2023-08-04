import { Box, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import React from 'react';

function ReviewBoxOwner (props) {
  return (
    <>
      <Box sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Rating
          name="spot use rating"
          value={props.rating}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
        />
        <Box sx={{ ml: 2 }}>{props.review}</Box>
      </Box>
    </>
  )
}
export default ReviewBoxOwner
