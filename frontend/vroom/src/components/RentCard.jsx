import ConfirmBookingDialog from './ConfirmBookingDialog';
import React from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import img from '../static/spot1.jpg';
import DateTimePickerVal from './DateTimePickerVal';
import makeRequest from '../utilities/makeRequest';

function RentCard (props) {
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('');

  const [startTime, setStartTime] = React.useState(dayjs())
  const [endTime, setEndTime] = React.useState(dayjs().add(1, 'hour'))

  const [cardNumber, setCardNumber] = React.useState('')
  const [cardName, setCardName] = React.useState('')
  const [cardCvv, setCardCvv] = React.useState('')

  const [regularPrice, setRegularPrice] = React.useState(0)
  const [surgedPrice, setSurgedPrice] = React.useState(0)

  const dialogReq = {
    userID: localStorage.getItem('vroom-id'),
    spotID: props.rentReq.spotID,
    startTime: startTime.unix(),
    endTime: endTime.unix(),
    cardNumber,
    cardName,
    cardCvv
  }

  const cardStyle = {
    margin: '0',
    padding: '5%',
    backgroundColor: '#fffffa',
    borderColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    rowGap: '15px'
  }

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '200px'
  }

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  }

  const errorStyle = {
    marginTop: '10px'
  }

  function formatPrice (price) {
    return `$${Number(price).toFixed(2)}`
  }

  async function confirmRenting () {
    // Basic data validation
    if (cardNumber.length !== 16 || isNaN(Number(cardNumber))) {
      setErrorMessage('Please input a valid card number. A valid card number should contain 16 digits.');
      setError(true);
      return;
    }
    if (cardName.length === 0) {
      setErrorMessage('Please enter a name for the card.');
      setError(true);
      return;
    }
    if (cardCvv.length !== 3 || isNaN(Number(cardCvv))) {
      setErrorMessage('Please input a valid CVV. A valid CVV should contain 3 digits.');
      setError(true);
      return;
    }

    const timeReq = {
      startTime: startTime.unix(),
      endTime: endTime.unix()
    }
    await makeRequest('POST', `book/${props.rentReq.spotID}/price`, timeReq).then((res) => {
      if (res.status === 200) {
        setRegularPrice(res.regularPrice);
        setSurgedPrice(res.surgedPrice);
        setOpen(true);
        setError(false);
      } else if (res.status === 409) {
        setErrorMessage('The Spot is not available now, book another time.');
        setError(true);
      }
    })
  }

  return (
    <>
      <Card sx={{ maxWidth: 1200 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} src={props.rentReq.image} aria-label="recipe" />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.rentReq.name}
          subheader={props.rentReq.email}
        />
        <CardMedia
          component="img"
          height="500"
          src={img}
          alt="Spot1"
        />
        <CardContent >
          <Typography paragraph>Description: {props.rentReq.description}</Typography>
          <Typography paragraph>Address: {props.rentReq.address}</Typography>
          <Typography paragraph>Largest Vehicle: {props.rentReq.largestVehicle}</Typography>
          <Typography paragraph>Clearance: {props.rentReq.clearance}m</Typography>
          <Typography paragraph>EV charging available: {props.rentReq.evCharging ? 'Yes' : 'No'}</Typography>
          <Typography paragraph>Disabled Access: {props.rentReq.disabledAccess ? 'Yes' : 'No'}</Typography>
          <Typography paragraph>Regular Price per hour: {formatPrice(props.rentReq.basePrice)}</Typography>
        </CardContent>
      </Card>
      <Card style={cardStyle}>
        <DateTimePickerVal changeStart={setStartTime} changeEnd={setEndTime} start={startTime} end={endTime} />
        <Typography>Cost will be incurred by the following card</Typography>
        <TextField fullWidth variant='outlined' size='small' label='Card Number' style={inputStyle} id='card-number-input'
                    value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}></TextField>
        <TextField fullWidth variant='outlined' size='small' label='Card Name' style={inputStyle} id='card-name-input'
                    value={cardName} onChange={(e) => setCardName(e.target.value)}/>
        <TextField fullWidth variant='outlined' size='small' label='CVV' style={inputStyle} id='cvv-input'
                    value={cardCvv} onChange={(e) => setCardCvv(e.target.value)}></TextField>
        {error && (<Alert severity="error" style={errorStyle}>{errorMessage}</Alert>)}
        <Button id='go-to-confirm-button' variant="contained" style={buttonStyle} align="center" onClick={confirmRenting}>Go to Confirmation</Button>
      </Card>
      {open && <ConfirmBookingDialog id='go-to-confirm-button' confirmReq={dialogReq} surgedPrice={surgedPrice} regularPrice={regularPrice} setOpen={setOpen} open={open} spotID={props.rentReq.spotID}/>}
    </>
  )
}
export default RentCard
