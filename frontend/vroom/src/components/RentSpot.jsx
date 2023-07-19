import React from "react"
import NavigationBar from "./NavigationBar"
import {useNavigate, useParams} from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import RentCard from "./RentCard";

function RentSpot () {

  const params = useParams();
  // const navigate = useNavigate()

  const [description, setDescription] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [largestVehicle, setLargestVehicle] = React.useState('')
  const [clearance, setClearance] = React.useState(0)
  const [evCharging, setEvCharging] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [basePrice, setBasePrice] = React.useState(0)


  const rentCardReq = {
      userID: localStorage.getItem('vroom-id'),
      spotID: params.spotID,
      address: address,
      description: description,
      clearance: clearance,
      evCharging: evCharging,
      disabledAccess: disabledAccess,
      largestVehicle: largestVehicle,
      basePrice: basePrice
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
      loadingRentDetails().then(r => {})
  }, [])

    
  return (
    <>
        <NavigationBar />
        <RentCard rentReq={rentCardReq}/>
    </>
  )
}

export default RentSpot