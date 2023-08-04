import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useParams, useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import RentCard from '../components/RentCard';

function RentSpot () {
  const params = useParams();
  const navigate = useNavigate()

  const [description, setDescription] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [largestVehicle, setLargestVehicle] = React.useState('');
  const [clearance, setClearance] = React.useState(0);
  const [evCharging, setEvCharging] = React.useState(false);
  const [disabledAccess, setDisabledAccess] = React.useState(false);
  const [basePrice, setBasePrice] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [name, setName] = React.useState('')
  const [image, setImage] = React.useState('')
  const [email, setEmail] = React.useState('')

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const rentCardReq = {
    userID: localStorage.getItem('vroom-id'),
    spotID: params.spotID,
    address,
    description,
    clearance,
    evCharging,
    disabledAccess,
    largestVehicle,
    basePrice,
    name,
    image,
    email
  }

  React.useEffect(() => {
    async function loadingRentDetails () {
      const res = await makeRequest('GET', `spot/${params.spotID}`, {})
      const spot = res.data

      setDescription(spot.description)
      setClearance(spot.clearance)
      setEvCharging(spot.evCharging)
      setDisabledAccess(spot.disabledAccess)
      setLargestVehicle(spot.largestVehicle)
      setBasePrice(spot.basePrice)

      const address = spot.streetNumber + ' ' + spot.streetName + ' ' + spot.suburb + ' ' + spot.postcode
      setAddress(address)

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
    loadingRentDetails().then(r => {})
  }, [])

  return (
    <>
      <NavigationBar loading={loading} />
      <RentCard rentReq={rentCardReq}/>
    </>
  )
}

export default RentSpot
