import React from "react"
import NavigationBar from "./NavigationBar"
import {useNavigate, useParams} from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DateTimePickerVal from "./DateTimePickerVal";
import {red} from "@mui/material/colors";
import dayjs from "dayjs";
import img from '../static/spot1.jpg'
import ConfirmBookingDialog from "./ConfirmBookingDialog";

function RentSpot () {

  const params = useParams();
  // const navigate = useNavigate()

  const [description, setDescription] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [largestVehicle, setLargestVehicle] = React.useState('')
  const [clearance, setClearance] = React.useState(0)
  const [evCharging, setEvCharging] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)

  const [startTime, setStartTime] = React.useState(dayjs())
  const [endTime, setEndTime] = React.useState(dayjs().add(1, "hour"))

  const [basePrice, setBasePrice] = React.useState(0)

  const [price, setPrice] = React.useState(0)

  const [cardNumber, setCardNumber] = React.useState('')
  const [cardName, setCardName] = React.useState('')
  const [cardCVV, setCardCVV] = React.useState('')

  const [open, setOpen] = React.useState(false)

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

  const dialogReq = {
      spotID: params.spotID,
      startTime: startTime.unix(),
      endTime: endTime.unix(),
      cardNumber: cardNumber,
      cardName: cardName,
      cardCvv: cardCVV
  }

  React.useEffect(()=> {
      async function loadingRentDetails() {

          const res = await makeRequest('GET', `spot/${params.spotID}`, {})
          const spot = res.data

          setDescription(spot.description)
          setClearance(spot.clearance)
          setEvCharging(spot.evCharging)
          setDisabledAccess(spot.disabledAccess)
          setLargestVehicle(spot.largestVehicle)
          setBasePrice(spot.basePrice)

          const address = spot.streetNumber + " " + spot.streetName + " " + spot.suburb + " " + spot.postcode
          setAddress(address)

          //console.log(startTime)
          //console.log(endTime)

      }
      loadingRentDetails()
  }, [])

  async function confirmRenting() {
      setOpen(true)
      const timeReq = {
          startTime: startTime.unix(),
          endTime: endTime.unix()
      }
      const priceRes = await makeRequest('POST', `book/${params.spotID}/price`, timeReq)
      setPrice(priceRes.price)
      console.log(priceRes)
  }
    
  return (
    <>
        <NavigationBar />
        <Card sx={{maxWidth: 600}}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        P
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Perfect parking spot for you"
                subheader="Run Chen"
            />
            <CardMedia
                component="img"
                height="255"
                src={img}
                alt="Spot1"
            />
            <CardContent >
                <Typography paragraph>Description: {description}</Typography>
                <Typography paragraph>Address: {address}</Typography>
                <Typography paragraph>Largest Vehicle: {largestVehicle}</Typography>
                <Typography paragraph>Clearance: {clearance}</Typography>
                <Typography paragraph>EV charging available: {evCharging ? 'Yes' : 'No'}</Typography>
                <Typography paragraph>Disabled Access: {disabledAccess ? 'Yes' : 'No'}</Typography>
                <Typography paragraph>Regular Price per hour: ${basePrice}</Typography>
            </CardContent>
        </Card>
        <Card style={cardStyle}>
            <DateTimePickerVal changeStart={setStartTime} changeEnd={setEndTime} start={startTime} end={endTime} />
            <div>{"Revenue will be paid into the following bank account"}</div>
            <TextField fullWidth variant='outlined' size='small' label='Card Number' style={inputStyle}
                       value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}></TextField>
            <TextField fullWidth variant='outlined' size='small' label='Card Name' style={inputStyle}
                       value={cardName} onChange={(e) => setCardName(e.target.value)}/>
            <TextField fullWidth variant='outlined' size='small' label='CVV' style={inputStyle}
                       value={cardCVV} onChange={(e) => setCardCVV(e.target.value)}></TextField>
            <Button variant="contained" style={buttonStyle} align="center" onClick={confirmRenting}>Go to Confirmation</Button>
        </Card>
        <ConfirmBookingDialog confirmReq={dialogReq} price={price} open={open} setOpen={setOpen}/>
    </>
  )
}

export default RentSpot