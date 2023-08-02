import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useParams, useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import dayjs from 'dayjs';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import ReviewBoxOwner from '../components/ReviewBoxOwner';

function SpotUseOwner () {
  const params = useParams();

  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate()

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const [address, setAddress] = React.useState('')
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [revenue, setRevenue] = React.useState(0)

  const [rating, setRating] = React.useState(2.5)
  const [review, setReview] = React.useState('')

  const timeStampToDate = (timeStamp) => {
    const date = dayjs.unix(timeStamp).format('ddd, MMM D, YYYY h:mm A')
    return date
  }

  async function loadingSpotUseDetails () {
    const booking = await makeRequest('GET', `booking/${params.bookingID}`, {})
    setRating(booking.rating)
    setReview(booking.review)
    setRevenue(booking.price)

    const spotRes = await makeRequest('GET', `spot/${booking.spotID}`, {})
    const spot = spotRes.data
    const address = spot.streetNumber + ' ' + spot.streetName + ' ' + spot.suburb + ' ' + spot.postcode
    setAddress(address)

    setStartTime(timeStampToDate(booking.startTime))
    setEndTime(timeStampToDate(booking.endTime))
    setLoading(false);
  }

  React.useEffect(() => {
    loadingSpotUseDetails().then(r => {})
  }, [])

  return (
    <>
      <NavigationBar loading={loading} />
      <Card >
          <CardHeader >
              <Typography paragraph variant="h5">Booking Details</Typography>
          </CardHeader>
          <CardContent>
              <Typography paragraph>Address: {address}</Typography>
              <Typography paragraph>StartTime: {startTime}</Typography>
              <Typography paragraph>EndTime: {endTime}</Typography>
              <Typography paragraph>Revenue:${revenue}</Typography>
              <ReviewBoxOwner rating={rating} review={review}/>
          </CardContent>
      </Card>
    </>
  )
}
export default SpotUseOwner
