import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const geoRef = require('../postcodes.json');

const weatherMap = {
  clear: 'Clear',
  pcloudy: 'Partly Cloudy',
  mcloudy: 'Cloudy',
  cloudy: 'Cloudy',
  humid: 'Partly Cloudy',
  lightrain: 'Showers',
  oshower: 'Showers',
  ishower: 'Showers',
  lightsnow: 'Snow Showers',
  rain: 'Rain',
  snow: 'Snow',
  rainsnow: 'Snow',
  ts: 'Thunderstorm',
  tsrain: 'Thunderstorm'
}

const getWeather = async (postcode) => {
  try {
    const targetRecords = geoRef.filter(record => record.postcode === postcode)
    if (targetRecords.length === 0) {
      return {
        status: 404,
        message: `weather information is not available for ${postcode}`
      }
    } else {
      // Note: following lines have camelcase rule disabled, variables need to
      // be in the same form as in the response
      const { Lat_precise, Long_precise } = targetRecords[0] // eslint-disable-line camelcase
      const url = `http://www.7timer.info/bin/api.pl?lon=${Long_precise}&lat=${Lat_precise}&product=civillight&output=json` // eslint-disable-line camelcase
      const weatherInfo = await (await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })).json();
      // if error above, it will be caught as a 500 server error
      const summary = []
      const low = []
      const high = []
      weatherInfo.dataseries.forEach(day => {
        low.push(day.temp2m.min)
        high.push(day.temp2m.max)
        summary.push(weatherMap[day.weather])
      });
      return {
        status: 200,
        summary,
        low,
        high,
        message: `weather information successfully retrived for ${postcode}`
      }
    }
  } catch (error) {
    console.error('Error getting weather information:', error);
    return {
      status: 500,
      message: 'weather information retrival FAILED',
      error: error.message
    };
  }
}

export { getWeather }
