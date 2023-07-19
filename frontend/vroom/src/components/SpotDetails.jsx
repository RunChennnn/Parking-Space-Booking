import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import { useNavigate } from "react-router-dom";
import {Avatar, Button, Card, CardContent, CardHeader, CardMedia, IconButton, Typography} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {red} from "@mui/material/colors";
import img from '../static/spot1.jpg'
import SpotCard from "./SpotCard";

function SpotDetails () {

  const params = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = React.useState('')

  const [address, setAddress] = React.useState('')

  const [largestVehicle, setLargestVehicle] = React.useState(0)
  const [clearance, setClearance] = React.useState('')
  const [evCharging, setEvCharging] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [basePrice, setBasePrice] = React.useState('')

  const [averRate, setAverRate] = React.useState(0)
  const [reviews, setReviews] = React.useState([])

  const buttonStyle = {
      margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
      width: '100px'
  }

  const cardInfo = {
      spotID: params.spotID,
      description: description,
      address: address,
      largestVehicle: largestVehicle,
      clearance: clearance,
      evCharging: evCharging,
      disabledAccess: disabledAccess,
      basePrice: basePrice,
      averRate: averRate,
      reviews: reviews
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

      const averRateRes = await makeRequest('GET', `spot/${params.spotID}/rating`, {})
      setAverRate(averRateRes.rating)

      const reviewsRes = await makeRequest('GET', `spot/${params.spotID}/review?num=10`, {})
      setReviews(reviewsRes.reviews)


  }



  return (
    <>
      <NavigationBar />
      <SpotCard cardInfo={cardInfo}/>

      <Button variant="contained" style={buttonStyle} onClick={toRentPage}>RENT</Button>
    </>
  )
}

export default SpotDetails