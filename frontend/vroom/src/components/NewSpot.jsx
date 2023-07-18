import React from "react"
import NavigationBar from "./NavigationBar";
import {useNavigate, useParams} from "react-router-dom";
import makeRequest from "../utilities/makeRequest";
import {Button, Card, Checkbox, TextField} from "@mui/material";
import {FormControl, FormLabel, FormControlLabel, Radio, RadioGroup} from "@mui/material";

function NewSpot () {

    //const params = useParams()

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

    // variale for radio group
    const [demandPricing, setDemandPricing] = React.useState(false)
    const [disabledAccess, setDisabledAccess] = React.useState(false)
    const [evCharging, setEvCharging] = React.useState(false)

    const [showError, setShowError] = React.useState(false);

    const buttonStyle = {
        margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
        width: '100px'
    }

    const inputStyle = {
        backgroundColor: '#fff',
        margin: '0',
        padding: '0'
    };

    const errorStyle = {
        marginTop: '10px',
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

    const handleDemandPricingChange = (e) => {
        setDemandPricing(e.target.checked)
    }

    const handleDisabledAccessChange = (e) => {
        setDisabledAccess(e.target.checked)
    }

    const handleEvChargingChange = (e) => {
        setEvCharging(e.target.checked)
    }


    async function confirmRegister() {
        const req = {
            basePrice: basePrice,
            cardCVV: cardCVV,
            cardName: cardName,
            cardNumber: cardNumber,
            clearance: clearance,
            demandPricing: demandPricing,
            description: description,
            disabledAccess: disabledAccess,
            evCharging: evCharging,
            largestVehicle: largestVehicle,
            owner: localStorage.getItem('vroom-id'),
            postcode: postcode,
            streetName: streetName,
            streetNumber: streetNumber,
            suburb: suburb
        }
        const res = await makeRequest('POST', 'spot/new', req)
        if (res.error) {
            setShowError(true)
            console.log('invalid input')
        }
        else {
            navigate(`/spots/${localStorage.getItem('vroom-id')}`)
        }
    }
    
    return (
        <>
            <Card style={cardStyle}>
                <NavigationBar />
                <div>{"New Spot"}</div>
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
                <div>{"Revenue will be paid into the following bank account"}</div>
                <TextField fullWidth variant='outlined' size='small' label='Card Number'
                           value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}></TextField>
                <TextField width='5px' variant='outlined' size='small' label='Card Name'
                           value={cardName} onChange={(e) => setCardName(e.target.value)}/>
                <TextField width='1px' variant='outlined' size='small' label='CVV'
                           value={cardCVV} onChange={(e) => setCardCVV(e.target.value)}></TextField>
            </Card>
            <Button variant="contained" style={buttonStyle} align="center" onClick={confirmRegister}>Register</Button>
        </>
    )
}

export default NewSpot