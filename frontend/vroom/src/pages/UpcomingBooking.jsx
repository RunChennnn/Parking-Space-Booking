import React from 'react';
import makeRequest from '../utilities/makeRequest';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import {
  Button,
  Card, CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Typography
} from '@mui/material';
import dayjs from 'dayjs'
import img from '../static/booking1.jpg'

function UpcomingBooking () {
  const params = useParams()
  const navigate = useNavigate()

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  // spot address
  const [address, setAddress] = React.useState('')
  // renting price
  const [price, setPrice] = React.useState(0)

  // booking time()
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')

  const [dialogVisible, setDialogVisible] = React.useState(false)

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
  }

  const timeStampToDate = (timeStamp) => {
    const date = dayjs.unix(timeStamp).format('ddd, MMM D, YYYY h:mm A')
    return date
  }

  async function loadingBookingDetails () {
    const res = await makeRequest('GET', `booking/${params.bookingID}`, {})
    const booking = res

    console.log(booking)

    const spotRes = await makeRequest('GET', `spot/${booking.spotID}`, {})
    // console.log(spotRes)

    const spot = spotRes.data
    console.log(spot)

    const address = spot.streetNumber + ' ' + spot.streetName + ' ' + spot.suburb + ' ' + spot.postcode
    setAddress(address)

    const startTime = timeStampToDate(booking.startTime)
    const endTime = timeStampToDate(booking.endTime)

    setStartTime(startTime)
    setEndTime(endTime)
    setPrice(booking.price)
  }

  React.useEffect(() => {
    loadingBookingDetails().then(r => {})
  }, [])

  const handleClose = () => {
    setDialogVisible(false)
  }

  const handleClickOpen = () => {
    setDialogVisible(true)
  }

  async function confirmCancel () {
    const res = await makeRequest('DELETE', `booking/${params.bookingID}/cancel`)
    if (res.error) {
      alert('fail to cancel')
      handleClose()
    } else {
      handleClose()
      navigate(`/account/${localStorage.getItem('vroom-id')}`)
    }
  }

  return (
        <>
            <NavigationBar/>
            <Card sx={{ maxWidth: 600 }}>
                <CardMedia
                    component="img"
                    height="255"
                    src={img}
                    alt="Book1"
                />
                <CardContent>
                    <Typography paragraph>Address: {address}</Typography>
                    <Typography paragraph>StartFrom: {startTime}</Typography>
                    <Typography paragraph>EndAt: {endTime}</Typography>
                    <Typography paragraph>Price: ${price}</Typography>
                </CardContent>
            </Card>
            <Button id='cancel-button' variant="contained" style={buttonStyle} onClick={handleClickOpen} color="error">CANCEL</Button>
            <Dialog
                open={dialogVisible}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Cancel booking confirmation'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Make sure you wanna to cancel this booking
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id='cancel-cancel-button' onClick={handleClose} color="primary">Cancel</Button>
                    <Button id='confirm-cancel-button' onClick={confirmCancel} color="error" autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
  )
}
export default UpcomingBooking
