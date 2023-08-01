import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar';
import {
  Button,
  Alert, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog
} from '@mui/material';
import makeRequest from '../utilities/makeRequest';
import UpdateCard from '../components/UpdateCard';

function UpdateSpot () {
  const params = useParams()
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

  // variale for checkbox group
  const [demandPricing, setDemandPricing] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [evCharging, setEvCharging] = React.useState(false)

  const [open, setOpen] = React.useState(false)

  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const cardInfo = {
    spotID: params.spotID,
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
    cardCVV,
    demandPricing,
    disabledAccess,
    evCharging
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

  const buttonStyle = {
    margin: '20px 20px 10px 20px',
    width: '100px'
  }

  const errorStyle = {
    marginTop: '10px'
  }

  const container = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (e) => {
    setOpen(false)
  }

  React.useEffect(() => {
    async function loadingSpotInfo () {
      const res = await makeRequest('GET', `spot/${params.spotID}`, {})
      const spot = res.data

      setDescription(spot.description)
      setStreetNumber(spot.streetNumber)
      setStreetName(spot.streetName)
      setSuburb(spot.suburb)
      setPostcode(spot.postcode)
      setBasePrice(spot.basePrice)
      setLargestVehicle(spot.largestVehicle)
      setClearance(spot.clearance)
      setCardNumber(spot.cardNumber)
      setCardName(spot.cardName)
      setCardCVV(spot.cardCVV)

      setDemandPricing(spot.demandPricing)
      setDisabledAccess(spot.disabledAccess)
      setEvCharging(spot.evCharging)
    }
    loadingSpotInfo().then(r => {})
    // console.log(res)
  }, [])

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

  async function confirmUpdate () {
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
    const res = await makeRequest('PATCH', `spot/${params.spotID}/update`, req)
    if (res.error) {
      // setShowError(true)
      console.log('invalid input')
    } else {
      navigate(`/spots/${localStorage.getItem('vroom-id')}`)
    }
  }

  async function confirmDelete () {
    const res = await makeRequest('DELETE', `spot/${params.spotID}/delete`)
    if (res.error) {
      alert('fail to delete')
      handleClose()
    } else {
      handleClose()
      navigate(`/spots/${localStorage.getItem('vroom-id')}`)
    }
  }

  return (
        <>
            <NavigationBar />
            <UpdateCard cardInfo={cardInfo} cardSet={cardSet} dialogOpen={open} setOpen={setOpen}/>
            {error && (<Alert severity="error" style={errorStyle}>{errorMessage}</Alert>)}
            <div style={container}>
                 <Button id='update-button' variant="contained" style={buttonStyle} onClick={confirmUpdate}>Update</Button>
                 <Button id='delete-button' variant="contained" style={buttonStyle} onClick={handleClickOpen} color="error">Delete</Button>
            </div>
          <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Delete Spot confirmation'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Make sure you confirm to remove this parking spot
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button id='cancel-button' onClick={handleClose} color="primary">Cancel</Button>
              <Button id='confirm-button' onClick={confirmDelete} color="error" autoFocus>Confirm</Button>
            </DialogActions>
          </Dialog>
        </>
  )
}

export default UpdateSpot
