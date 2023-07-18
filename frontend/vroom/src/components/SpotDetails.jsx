import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import { useNavigate } from "react-router-dom";
import {Avatar, Button, Card, CardContent, CardHeader, CardMedia, IconButton, Typography} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {red} from "@mui/material/colors";

function SpotDetails () {

  const params = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = React.useState('')

  const [address, setAddress] = React.useState('')

  const [largestVehicle, setLargestVehicle] = React.useState('')
  const [clearance, setClearance] = React.useState('')
  const [evCharging, setEvCharging] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [basePrice, setBasePrice] = React.useState('')

  // review of past renters
  const [reviews, setReviews] = React.useState([])
  const [averRate, setAverRate] = React.useState(0)

  const buttonStyle = {
      margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
      width: '100px'
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
    };

  const getAverageRate = (reviews) => {
      let averRate = 0, total = 0
      for(const review of reviews) {
          averRate += review.rate
          total += 1
      }
      return averRate/total
  }


  function toRentPage() {
    navigate(`/spot/${params.spotID}/rent`)
  }

  React.useEffect(()=> {
    loadingSpotDetails().then(r => {})
  }, [])

  async function loadingSpotDetails() {
      const res = await makeRequest('GET', `spot/${params.spotID}`, {})
      const spot = res.data

      //const reviewRes = await makeRequest('GET', ,{})
      //const reviews = reviewRes.data

      setDescription(spot.description)

      const address = spot.streetNumber + " " + spot.streetName + " " + spot.suburb + " " + spot.postcode
      setAddress(address)

      setLargestVehicle(spot.largestVehicle)
      setClearance(spot.clearance)
      setEvCharging(spot.evCharging)
      setDisabledAccess(spot.disabledAccess)

      setBasePrice(spot.basePrice)

      //setReviews(reviews)

      //const rates = reviews.rates
      //const averRate = getAverageRate(rates)
      //setAverRate(averRate)

  }


    
  return (
    <>
      <NavigationBar />
        <Card sx={{maxWidth: 1200}}>
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
                height="500"
                image='../static/spot1.jpg'
                alt="Spot1"
            />
            <CardContent >
                <Typography paragraph>Description: {description}</Typography>
                <Typography paragraph>Address: {address}</Typography>
                <Typography paragraph>LargestVehicle: {largestVehicle}</Typography>
                <Typography paragraph>Clearance: {clearance}</Typography>
                <Typography paragraph>EV charging available: {evCharging ? 'Yes': 'No'}</Typography>
                <Typography paragraph>DisabledAccess: {disabledAccess ? 'Yes' : 'No'}</Typography>
                <Typography paragraph>Price: ${basePrice}</Typography>
                <Typography paragraph>Average rate: {averRate}/5</Typography>
            </CardContent>
        </Card>
      <Button variant="contained" style={buttonStyle} onClick={toRentPage}>RENT</Button>
    </>
  )
}

export default SpotDetails