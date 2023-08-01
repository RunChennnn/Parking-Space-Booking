import {
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import React from 'react';

function UpdateCard (props) {
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

  const largestVehicleOptions = ['Motorbike', 'Sedan', '4WD', 'Van', 'Truck']

  const handleDemandPricingChange = (e) => {
    props.cardSet.setDemandPricing(e.target.checked)
  }

  const handleDisabledAccessChange = (e) => {
    props.cardSet.setDisabledAccess(e.target.checked)
  }

  const handleEvChargingChange = (e) => {
    props.cardSet.setEvCharging(e.target.checked)
  }

  const handleLargestVehicleSelected = (e) => {
    props.cardSet.setLargestVehicle(e.target.value)
  }

  return (
        <>
            <Card style={cardStyle}>
                <div>{'Update Spot'}</div>
                <TextField fullWidth variant='outlined' size='small' label='Description' id='description-input'
                           placeholder='Description' style={inputStyle}
                           value={props.cardInfo.description} onChange={(e) => props.cardSet.setDescription(e.target.value)}></TextField>
                <TextField width='1px' variant='outlined' size='small' label='Street Number' id='street-number-input'
                           placeholder='42' style={inputStyle}
                           value={props.cardInfo.streetNumber} onChange={(e) => props.cardSet.setStreetNumber(e.target.value)}/>
                <TextField width='5px' variant='outlined' size='small' label='Street Name' id='street-name-input'
                           placeholder='Wallaby way' style={inputStyle}
                           value={props.cardInfo.streetName} onChange={(e) => props.cardSet.setStreetName(e.target.value)}></TextField>
                <TextField width='5px' variant='outlined' size='small' label='Suburb' id='suburb-input'
                           placeholder='Sydney' style={inputStyle}
                           value={props.cardInfo.suburb} onChange={(e) => props.cardSet.setSuburb(e.target.value)}/>
                <TextField width='1px' variant='outlined' size='small' label='Postcode' id='postcode-input'
                           placeholder='2000' style={inputStyle}
                           value={props.cardInfo.postcode} onChange={(e) => props.cardSet.setPostcode(e.target.value)}></TextField>
                <FormControl variant="standard">
                    <FormControlLabel control={<Checkbox id='surge-pricing-input' checked={props.cardInfo.demandPricing} onChange={handleDemandPricingChange} name="DemandPricing"/> }
                                      label="DemandPricing"/>
                </FormControl>
                <TextField width='1px' variant='outlined' size='small' label='Base price per hour(AUD)' id='price-input'
                           placeholder='16' style={inputStyle}
                           value={props.cardInfo.basePrice} onChange={(e) => props.cardSet.setBasePrice(e.target.value)}/>
                <FormControl fullWidth>
                    <InputLabel id="largest-vehicle-select">LargestVehicle</InputLabel>
                    <Select
                        labelId="largest-vehicle-select"
                        id="largest-select"
                        value={props.cardInfo.largestVehicle}
                        onChange={handleLargestVehicleSelected}
                    >
                        <MenuItem id={largestVehicleOptions[1]} value={largestVehicleOptions[0]}>Motorbike</MenuItem>
                        <MenuItem id={largestVehicleOptions[2]} value={largestVehicleOptions[1]}>Sedan</MenuItem>
                        <MenuItem id={largestVehicleOptions[3]} value={largestVehicleOptions[2]}>4WD</MenuItem>
                        <MenuItem id={largestVehicleOptions[4]} value={largestVehicleOptions[3]}>Van</MenuItem>
                        <MenuItem id={largestVehicleOptions[5]} value={largestVehicleOptions[4]}>Truck</MenuItem>
                    </Select>
                </FormControl>
                <TextField width='1px' variant='outlined' size='small' label='Clearance height' id='clearance-input'
                           placeholder='2.2' style={inputStyle}
                           value={props.cardInfo.clearance} onChange={(e) => props.cardSet.setClearance(e.target.value)}></TextField>
                <FormControl variant="standard">
                    <FormControlLabel control={<Checkbox id='disabled-input' checked={props.cardInfo.disabledAccess} onChange={handleDisabledAccessChange} name="DisabledAccess"/> }
                                      label="DisabledAccess"/>
                </FormControl>
                <FormControl variant="standard">
                    <FormControlLabel control={<Checkbox id='ev-input' checked={props.cardInfo.evCharging} onChange={handleEvChargingChange} name="EvCharging"/> }
                                      label="EvCharging"/>
                </FormControl>
                <div>{'Revenue will be paid into the following bank account'}</div>
                <TextField fullWidth variant='outlined' size='small' label='Card Number' id='card-number-input'
                           value={props.cardInfo.cardNumber} onChange={(e) => props.cardSet.setCardNumber(e.target.value)}></TextField>
                <TextField width='5px' variant='outlined' size='small' label='Card Name' id='card-name-input'
                           value={props.cardInfo.cardName} onChange={(e) => props.cardSet.setCardName(e.target.value)}/>
                <TextField width='1px' variant='outlined' size='small' label='CVV' id='cvv-input'
                           value={props.cardInfo.cardCVV} onChange={(e) => props.cardSet.setCardCVV(e.target.value)}></TextField>
            </Card>
        </>
  )
}
export default UpdateCard
