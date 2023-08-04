import React from 'react'
import { Box, Rating, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function ReviewBoxRenter (props) {
  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  };

  const rateLabels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  }

  return (
    <>
      <Box sx={{ ml: 2 }}>{'Leave your review here!'}</Box>
      <Box sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Rating id='rating-input'
          name="spot use rating"
          value={props.rating}
          onChange={(e, value) => { props.setRating(value) }}
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
        />
        <Box sx={{ ml: 2 }}>{rateLabels[props.rating]}</Box>
      </Box>
      <TextField fullWidth variant="outlined" style={inputStyle} value={props.review} id='review-input'
                  placeholder="write your review here" onChange={(e) => { props.setReview(e.target.value) }}/>
    </>
  )
}
export default ReviewBoxRenter
