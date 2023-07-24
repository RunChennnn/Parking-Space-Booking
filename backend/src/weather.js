import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const geoRef = require('../australian_postcodes.json');

const getWeather = async (postcode) => {
    try {
        const targetRecords = geoRef.filter(record => record.postcode === postcode)
        if (targetRecords.length === 0 ){
            return {
                status: 404,
                message: `weather information is not available for ${postcode}`      
            }
        } else {
            const { lat, long } = targetRecords[0]
            const url = `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civillight&output=json`
            const weatherInfo = await (await fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            })).json();
            // if error above, it will be caught as a 500 server error
            let summary = []
            let low = []
            let high = []
            weatherInfo.dataseries.forEach(day => {
                low.push(day.temp2m.min)
                high.push(day.temp2m.max)
                summary.push(day.weather)
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