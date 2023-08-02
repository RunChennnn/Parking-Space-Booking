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
import { adminIsLoggedIn } from '../utilities/admin';

function UpcomingBooking () {
  const params = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true);
  const [spotID, setSpotID] = React.useState('');

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  // spot address
  const [address, setAddress] = React.useState('')
  // renting price
  const [price, setPrice] = React.useState(0)

  // booking time()
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')

  // const [refundAvailable, setRefundAvailable] = React.useState(0)

  const [popupText, setPopupText] = React.useState('');

  const [dialogVisible, setDialogVisible] = React.useState(false)

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
  }

  const timeStampToDate = (timeStamp) => {
    const date = dayjs.unix(timeStamp).format('ddd, MMM D, YYYY h:mm A')
    return date
  }

  function formatPrice (price) {
    return `$${Number(price).toFixed(2)}`
  }

  function makePopupText (price, refAv, owner) {
    if (adminIsLoggedIn()) {
      // Give full refund if refunded by admin
      return `Cancelling this booking as the system administrator will trigger a full refund of ${formatPrice(price)}. Please confirm you wish to proceed.`
    } else if (localStorage.getItem('vroom-id') === owner) {
      return `Cancelling this booking as the spot's owner will trigger a full refund of ${formatPrice(price)}. Please confirm you wish to proceed.`
    } else if (refAv === 1) {
      return `If you cancel this booking now, you will receive a full refund of ${formatPrice(price)}. Please confirm you wish to proceed.`
    } else if (refAv === 0.5) {
      return `If you cancel this booking now, you will receive a 50% refund of ${formatPrice(price)}. Please confirm you wish to proceed.`
    } else {
      return 'If you cancel this booking now, you will not receive a refund. Please confirm you wish to proceed.'
    }
  }

  async function loadingBookingDetails () {
    const res = await makeRequest('GET', `booking/${params.bookingID}`, {})
    console.log(res)
    const booking = res
    setSpotID(booking.spotID);

    const spotRes = await makeRequest('GET', `spot/${booking.spotID}`, {})
    console.log(spotRes)

    const spot = spotRes.data
    // console.log(spot)

    const address = spot.streetNumber + ' ' + spot.streetName + ' ' + spot.suburb + ' ' + spot.postcode
    setAddress(address)

    const startTime = timeStampToDate(booking.startTime)
    const endTime = timeStampToDate(booking.endTime)

    setStartTime(startTime)
    setEndTime(endTime)
    setPrice(booking.price)
    // setRefundAvailable(booking.refundAvailable)
    setPopupText(makePopupText(booking.price, booking.refundAvailable, spot.owner))
    setLoading(false);
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

  function clickViewSpot () {
    navigate(`/spot/${spotID}`)
  }

  return (
        <>
            <NavigationBar loading={loading} />
            <Card sx={{ maxWidth: 600 }}>
                <CardMedia
                    component="img"
                    height="255"
                    src={img}
                    alt="Book1"
                />
                <CardContent>
                    <Typography paragraph>Address: {address} <Button id='view-spot-button' onClick={clickViewSpot}>View</Button></Typography>
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
                        {/* The refund is {refundAvailable * price}, Make sure you wanna to cancel this booking */}
                        {popupText}
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
