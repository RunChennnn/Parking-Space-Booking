import React from 'react'
import NavigationBar from './NavigationBar'
import { useParams } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import dayjs from 'dayjs';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import ReviewBoxRenter from './ReviewBoxRenter';

function SpotUseRenter () {
  const params = useParams();

  const [address, setAddress] = React.useState('')
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [revenue, setRevenue] = React.useState(0)

  const [rating, setRating] = React.useState(0)
  const [review, setReview] = React.useState('')

  const timeStampToDate = (timeStamp) => {
    const date = dayjs.unix(timeStamp).format('ddd, MMM D, YYYY h:mm A')
    return date
  }

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
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
  }

  async function uploadReviews () {
    const reviewReq = {
      rating,
      review
    }
    await makeRequest('POST', `booking/${params.bookingID}/review`, reviewReq)
  }

  React.useEffect(() => {
    loadingSpotUseDetails().then(r => {})
  }, [])

  return (
    <>
      <NavigationBar />
      <Card >
        <CardHeader >
          <Typography paragraph variant="h5">Booking Details</Typography>
        </CardHeader>
        <CardContent>
          <Typography paragraph>Address: {address}</Typography>
          <Typography paragraph>StartTime: {startTime}</Typography>
          <Typography paragraph>EndTime: {endTime}</Typography>
          <Typography paragraph>Revenue:${revenue}</Typography>
          <ReviewBoxRenter rating={rating} review={review} setRating={setRating} setReview={setReview}/>
        </CardContent>
      </Card>
      <Button style={buttonStyle} variant="contained" onClick={uploadReviews}>Confirm</Button>
    </>
  )
}

export default SpotUseRenter
