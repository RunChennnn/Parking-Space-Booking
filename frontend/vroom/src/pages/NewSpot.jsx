import React from 'react'
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../utilities/makeRequest';
import { Alert, Button } from '@mui/material';
import NewCard from '../components/NewCard';

function NewSpot () {
  // const params = useParams()

  const navigate = useNavigate()

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const [description, setDescription] = React.useState('');
  const [streetNumber, setStreetNumber] = React.useState('')
  const [streetName, setStreetName] = React.useState('')
  const [suburb, setSuburb] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [basePrice, setBasePrice] = React.useState(0);
  const [largestVehicle, setLargestVehicle] = React.useState('');
  const [clearance, setClearance] = React.useState(0);

  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardCVV, setCardCVV] = React.useState('');

  // variale for radio group
  const [demandPricing, setDemandPricing] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [evCharging, setEvCharging] = React.useState(false)

  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const cardInfo = {
    description,
    streetNumber,
    streetName,
    suburb,
    postcode,
    basePrice,
    largestVehicle,
    clearance,
    cardNumber,
    cardName,
    cardCVV
  }

  const cardSet = {
    setDescription,
    setStreetNumber,
    setStreetName,
    setSuburb,
    setPostcode,
    setBasePrice,
    setLargestVehicle,
    setClearance,
    setCardNumber,
    setCardName,
    setCardCVV,
    setDemandPricing,
    setDisabledAccess,
    setEvCharging
  }

  function validate () {
    if (streetNumber !== '' && isNaN(streetNumber)) {
      setErrorMessage('Please input a valid street number, or omit it.')
      setError(true)
      return false;
    }
    if (streetName === '') {
      setErrorMessage('Please input a street name.')
      setError(true)
      return false;
    }
    if (suburb === '') {
      setErrorMessage('Please input a suburb.')
      setError(true)
      return false;
    }
    if (`${postcode}`.length !== 4 || isNaN(postcode)) {
      setErrorMessage('Please input a valid 4-digit Australian postcode.')
      setError(true)
      return false;
    }
    if (largestVehicle === '') {
      setErrorMessage('Please select the largest vehicle type that can fit in your spot.')
      setError(true)
      return false;
    }
    if (isNaN(basePrice)) {
      setErrorMessage('Please input a valid price.')
      setError(true)
      return false;
    }
    if (isNaN(clearance)) {
      setErrorMessage('Please input a valid clearance height.')
      setError(true)
      return false
    }
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      setErrorMessage('Please input a valid card number. A valid card number should contain 16 digits.');
      setError(true);
      return false;
    }
    if (cardName.length === 0) {
      setErrorMessage('Please enter a name for the card.');
      setError(true);
      return false;
    }
    if (cardCVV.length !== 3 || isNaN(cardCVV)) {
      setErrorMessage('Please input a valid CVV. A valid CVV should contain 3 digits.');
      setError(true);
      return false;
    }
    return true;
  }

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
  }

  const errorStyle = {
    marginTop: '10px'
  }

  async function confirmRegister () {
    if (!validate()) { return }

    const req = {
      basePrice,
      cardCVV,
      cardName,
      cardNumber,
      clearance,
      demandPricing,
      description,
      disabledAccess,
      evCharging,
      largestVehicle,
      owner: localStorage.getItem('vroom-id'),
      postcode,
      streetName,
      streetNumber,
      suburb
    }
    const res = await makeRequest('POST', 'spot/new', req)
    if (res.error) {
      // setShowError(true)
      console.log('invalid input')
    } else {
      navigate(`/spots/${localStorage.getItem('vroom-id')}`)
    }
  }

  return (
        <>
            <NavigationBar />
            <NewCard cardInfo={cardInfo} cardSet={cardSet}/>
            {error && (<Alert severity="error" style={errorStyle}>{errorMessage}</Alert>)}
            <Button id='confirm-register-button' variant="contained" style={buttonStyle} align="center" onClick={confirmRegister}>Register</Button>
        </>
  )
}

export default NewSpot
