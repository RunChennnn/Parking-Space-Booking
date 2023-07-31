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

  const weather = props.weathers

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
            {props.weathers.summary.map((_, index) =>
                <ImageListItem key={`weather-${index}`} sx={{ height: 80 }}>
                  <img src={weatherIcons[weather.summary[index]]} />
                  <ImageListItemBar
                      title={`${weather.low[index]}°C/${weather.high[index]}°C`}
                      subtitle={dayjs().add(index, 'day').format('MMM D, YYYY')}
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
