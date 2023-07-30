import React from 'react';
import { Box, ImageListItem, ImageListItemBar } from '@mui/material';
import clear from '../static/clear.png'
import partlyCloudy from '../static/partly-cloudy.png'
import cloudy from '../static/cloudy.png'
import showers from '../static/showers.png'
import snowShowers from '../static/snowshowers.png'
import rain from '../static/rain.png'
import snow from '../static/snow.png'
import thunderstorm from '../static/thunderstorm.png'
import dayjs from 'dayjs';
function UpComingWeather (props) {
  const weatherIcons = {
    Clear: clear,
    'Partly Cloudy': partlyCloudy,
    Cloudy: cloudy,
    Showers: showers,
    'Snow Showers': snowShowers,
    Rain: rain,
    Snow: snow,
    Thunderstorm: thunderstorm
  }

  const indexOfTemp = (tmp) => {
    return props.weathers.summary.indexOf(tmp)
  }

  const loadLowTemp = (tmp) => {
    return props.weathers.low[indexOfTemp(tmp)]
  }

  const loadHighTemp = (tmp) => {
    return props.weathers.high[indexOfTemp(tmp)]
  }

  const loadUpcomingDates = (tmp) => {
    const idx = indexOfTemp(tmp)
    return dayjs().add(idx, 'day').format('MMM D, YYYY')
  }

  return (
        <>
          <Box sx={{
            maxWidth: 1200,
            height: 100,
            display: 'flex',
            justifyContent: 'flex-start',
            p: 1,
            m: 1,
            borderRadius: 2.5,
            margin: '0 0 50px 0 '
          }}>
            {props.weathers.summary.map((tmp) =>
                <ImageListItem key={tmp} sx={{ height: 80 }}>
                  <img src={weatherIcons[tmp]} />
                  <ImageListItemBar
                    title={`${loadLowTemp(tmp)}°C/${loadHighTemp(tmp)}°C`}
                    subtitle={loadUpcomingDates(tmp)}
                    position="below"
                    align="center"
                  />
                </ImageListItem>
            )}
          </Box>
        </>
  )
}
export default UpComingWeather
