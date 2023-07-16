import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import { useNavigate } from "react-router-dom";
import {Button, Card} from "@mui/material";

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
      margin: '20px 20px 10px 20px',
      width: '100px'
  }

  const getAverageRate = (reviews) => {
      let averRate = 0, total = 0
      for(const review of reviews) {
          averRate += review.rate
          total += 1
      }
      return averRate/total
  }


  function toRentPage() {
    navigate(`/spots/${params.spotID}/rent`)
  }

  React.useEffect(()=> {
    loadingSpotDetails().then(r => {})
  }, [])

  async function loadingSpotDetails() {
      const res = await makeRequest('GET', `/spots/${params.spotID}`, {})
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

      setReviews(reviews)

      const rates = reviews.rates
      const averRate = getAverageRate(rates)
      setAverRate(averRate)

  }


    
  return (
    <>
      <NavigationBar />

      <Button variant="outlined" style={buttonStyle} onClick={toRentPage}>RENT</Button>
    </>
  )
}

export default SpotDetails