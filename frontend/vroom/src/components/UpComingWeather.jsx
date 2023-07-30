import React from 'react';
import { Box } from '@mui/material';
function UpComingWeather (props) {
  return (
        <>
          <Box sx={{
            maxWidth: 1200,
            height: 300,
            display: 'flex',
            justifyContent: 'flex-start',
            p: 1,
            m: 1,
            borderRadius: 1,
          }}>
            {console.log(props.weathers.summary[0])}
            {console.log(props.weathers.summary[1])}
            {console.log(props.weathers.low[0])}
            {console.log(props.weathers.high[1])}
          </Box>
        </>
  )
}
export default UpComingWeather
