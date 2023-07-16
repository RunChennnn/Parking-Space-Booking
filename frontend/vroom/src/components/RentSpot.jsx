import React from "react"
import NavigationBar from "./NavigationBar"
import {useNavigate, useParams} from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import {Button} from "@mui/material";

function RentSpot () {

  const params = useParams();
  const navigate = useNavigate()

  const [description, setDescription] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [largestVehicle, setLargestVehicle] = React.useState('')
  const [clearance, setClearance] = React.useState(0)
  const [evCharging, setEvCharging] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)

  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')

  const [price, setPrice] = React.useState(0)

  const buttonStyle = {

  }

  async function loadingRentDetails() {
      const res = await makeRequest('GET', `/spots/${params.spotID}`, {})
      const spot = res.data

      setDescription(spot.description)
      setClearance(spot.clearance)
      setEvCharging(spot.evCharging)
      setDisabledAccess(spot.disabledAccess)

      setPrice(spot.basePrice)

      const address = spot.streetNumber + " " + spot.streetName + " " + spot.suburb + " " + spot.postcode
      setAddress(address)

  }

  const dateToTimeStamp = () => {

  }

  React.useEffect(()=> {
      loadingRentDetails().then(r => {})
  }, [])
    
  return (
    <>
      <NavigationBar />
        <Button variant="outlined" >Confirm</Button>
    </>
  )
}

export default RentSpot