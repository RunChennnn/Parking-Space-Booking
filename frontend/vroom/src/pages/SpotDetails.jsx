import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useParams, useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import { Button } from '@mui/material';
import SpotCard from '../components/SpotCard';

function SpotDetails () {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);

  const [description, setDescription] = React.useState('')

  const [address, setAddress] = React.useState('')

  const [largestVehicle, setLargestVehicle] = React.useState(0)
  const [clearance, setClearance] = React.useState('')
  const [evCharging, setEvCharging] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [basePrice, setBasePrice] = React.useState('')

  const [averRate, setAverRate] = React.useState(0)
  const [reviews, setReviews] = React.useState([])

  const [weathers, setWeathers] = React.useState(null)

  const [name, setName] = React.useState('')
  const [image, setImage] = React.useState('')
  const [email, setEmail] = React.useState('')

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
  }

  const cardInfo = {
    spotID: params.spotID,
    description,
    address,
    largestVehicle,
    clearance,
    evCharging,
    disabledAccess,
    basePrice,
    averRate,
    reviews,
    weathers,
    name,
    image,
    email,
  }

  function toRentPage () {
    navigate(`/spot/${params.spotID}/rent`)
  }

  React.useEffect(() => {
    loadingSpotDetails().then(r => {})
  }, [])

  async function loadingSpotDetails () {
    const res = await makeRequest('GET', `spot/${params.spotID}`, {})
    const spot = res.data

    await loadingUpcomingWeather(spot.postcode)

    setDescription(spot.description)

    const address = spot.streetNumber + ' ' + spot.streetName + ' ' + spot.suburb + ' ' + spot.postcode
    setAddress(address)

    setLargestVehicle(spot.largestVehicle)
    setClearance(spot.clearance)
    setEvCharging(spot.evCharging)
    setDisabledAccess(spot.disabledAccess)

    setBasePrice(spot.basePrice)

    const averRateRes = await makeRequest('GET', `spot/${params.spotID}/rating`, {})
    setAverRate(averRateRes.rating)

    const reviewsRes = await makeRequest('GET', `spot/${params.spotID}/reviews?num=10`, {})
    setReviews(reviewsRes.reviews)

    const user = await makeRequest('GET', `user/${res.data.owner}`)
    const imgRes = await makeRequest('GET', `user/${res.data.owner}/image`)
    if (user.displayName) {
      setName(user.displayName)
    } else {
      setName('No display name');
    }
    setEmail(user.email);
    if (imgRes.image) { setImage(imgRes.image) }
    setLoading(false);
  }
  async function loadingUpcomingWeather (postcode) {
    const weatherRes = await makeRequest('GET', `weather/${postcode}`, {})
    setWeathers(weatherRes)
  }

  return (
    <>
      <NavigationBar loading={loading} />
      {weathers !== null && <SpotCard cardInfo={cardInfo}/>}
      <Button id='rent-button' variant="contained" style={buttonStyle} onClick={toRentPage}>Rent</Button>
    </>
  )
}

export default SpotDetails
