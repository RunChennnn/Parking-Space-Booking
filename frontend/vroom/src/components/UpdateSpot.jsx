import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavigationBar from './NavigationBar';
import { Button, Card, Checkbox, FormControl, FormControlLabel, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import makeRequest from '../utilities/makeRequest';

function UpdateSpot () {
  const params = useParams()

  const navigate = useNavigate()

  const [description, setDescription] = React.useState('');
  const [streetNumber, setStreetNumber] = React.useState('')
  const [streetName, setStreetName] = React.useState('')
  const [suburb, setSuburb] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [basePrice, setBasePrice] = React.useState('');
  const [largestVehicle, setLargestVehicle] = React.useState('');
  const [clearance, setClearance] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardCVV, setCardCVV] = React.useState('');

  const [demandPricing, setDemandPricing] = React.useState(false)
  const [disabledAccess, setDisabledAccess] = React.useState(false)
  const [evCharging, setEvCharging] = React.useState(false)

  // const [showError, setShowError] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const buttonStyle = {
    margin: '20px 20px 10px 20px',
    width: '100px'
  }

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  };

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

  const container = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDemandPricingChange = (e) => {
    setDemandPricing(e.target.checked)
  }

  const handleDisabledAccessChange = (e) => {
    setDisabledAccess(e.target.checked)
  }

  const handleEvChargingChange = (e) => {
    setEvCharging(e.target.checked)
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
    loadingSpotInfo()
    // console.log(res)
  }, [])

  async function confirmUpdate () {
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
            <Card style={cardStyle}>
                <div>{'Update Spot'}</div>
                <TextField fullWidth variant='outlined' size='small' label='Description'
                           placeholder='Description' style={inputStyle}
                           value={description} onChange={(e) => setDescription(e.target.value)}></TextField>
                <TextField width='1px' variant='outlined' size='small' label='Street Number'
                           placeholder='42' style={inputStyle}
                           value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)}/>
                <TextField width='5px' variant='outlined' size='small' label='Street Name'
                           placeholder='Wallaby way' style={inputStyle}
                           value={streetName} onChange={(e) => setStreetName(e.target.value)}></TextField>
                <TextField width='5px' variant='outlined' size='small' label='Suburb'
                           placeholder='Sydney' style={inputStyle}
                           value={suburb} onChange={(e) => setSuburb(e.target.value)}/>
                <TextField width='1px' variant='outlined' size='small' label='Postcode'
                           placeholder='2000' style={inputStyle}
                           value={postcode} onChange={(e) => setPostcode(e.target.value)}></TextField>
                <FormControl variant="standard">
                    <FormControlLabel control={<Checkbox checked={demandPricing} onChange={handleDemandPricingChange} name="DemandPricing"/> }
                                      label="DemandPricing"/>
                </FormControl>
                <TextField width='1px' variant='outlined' size='small' label='Base price per hour(AUD)'
                           placeholder='16' style={inputStyle}
                           value={basePrice} onChange={(e) => setBasePrice(e.target.value)}/>
                <TextField width='5px' variant='outlined' size='small' label='Largest Vehicle'
                           placeholder='Select option' style={inputStyle}
                           value={largestVehicle} onChange={(e) => setLargestVehicle(e.target.value)}></TextField>
                <TextField width='1px' variant='outlined' size='small' label='Clearance height'
                           placeholder='2.2' style={inputStyle}
                           value={clearance} onChange={(e) => setClearance(e.target.value)}></TextField>
                <FormControl variant="standard">
                    <FormControlLabel control={<Checkbox checked={disabledAccess} onChange={handleDisabledAccessChange} name="DisabledAccess"/> }
                                      label="DisabledAccess"/>
                </FormControl>
                <FormControl variant="standard">
                    <FormControlLabel control={<Checkbox checked={evCharging} onChange={handleEvChargingChange} name="EvCharging"/> }
                                      label="EvCharging"/>
                </FormControl>
                <div>{'Revenue will be paid into the following bank account'}</div>
                <TextField fullWidth variant='outlined' size='small' label='Card Number'
                           value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}></TextField>
                <TextField width='5px' variant='outlined' size='small' label='Card Name'
                           value={cardName} onChange={(e) => setCardName(e.target.value)}/>
                <TextField width='1px' variant='outlined' size='small' label='CVV'
                           value={cardCVV} onChange={(e) => setCardCVV(e.target.value)}></TextField>
            </Card>
            <div style={container}>
                 <Button variant="contained" style={buttonStyle} onClick={confirmUpdate}>Update</Button>
                 <Button variant="contained" style={buttonStyle} onClick={handleClickOpen} color="error">Delete</Button>
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
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
  )
}

export default UpdateSpot
