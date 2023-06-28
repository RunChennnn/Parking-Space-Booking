import React from "react"
import {useNavigate, useParams} from 'react-router-dom'
import SpotNavigationBar from "./SpotNavigationBar";
import {Button, Card, TextField} from "@mui/material";
import makeRequest from "../utilities/makeRequest";

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

    const [showError, setShowError] = React.useState(false);

    const buttonStyle = {
        margin: '20px 30% 0 30%'
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

    React.useEffect(() => {
        async function loadingSpotInfo() {
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

        }
        loadingSpotInfo()
        //console.log(res)
    }, [])

    async function confirmUpdate() {
        const req = {
            basePrice: basePrice,
            cardCVV: cardCVV,
            cardName: cardName,
            cardNumber: cardNumber,
            clearance: clearance,
            demandPricing: true,
            description: description,
            disabledAccess: false,
            evCharging: true,
            largestVehicle: largestVehicle,
            owner: localStorage.getItem('vroom-id'),
            postcode: postcode,
            streetName: streetName,
            streetNumber: streetNumber,
            suburb: suburb
        }
        const res = await makeRequest('PATCH', `spot/${params.spotID}/update`, req)
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
            <SpotNavigationBar />
            <Card style={cardStyle}>
                <SpotNavigationBar />
                <div>{"Update Spot"}</div>
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
                <TextField width='1px' variant='outlined' size='small' label='Base price per hour(AUD)'
                           placeholder='16' style={inputStyle}
                           value={basePrice} onChange={(e) => setBasePrice(e.target.value)}/>
                <TextField width='5px' variant='outlined' size='small' label='Largest Vehicle'
                           placeholder='Select option' style={inputStyle}
                           value={largestVehicle} onChange={(e) => setLargestVehicle(e.target.value)}></TextField>
                <TextField width='1px' variant='outlined' size='small' label='Clearance height'
                           placeholder='2.2' style={inputStyle}
                           value={clearance} onChange={(e) => setClearance(e.target.value)}></TextField>
                <div>{"Revenue will be paid into the following bank account"}</div>
                <TextField fullWidth variant='outlined' size='small' label='Card Number'
                           value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}></TextField>
                <TextField width='5px' variant='outlined' size='small' label='Card Name'
                           value={cardName} onChange={(e) => setCardName(e.target.value)}/>
                <TextField width='1px' variant='outlined' size='small' label='CVV'
                           value={cardCVV} onChange={(e) => setCardCVV(e.target.value)}></TextField>
            </Card>
            <Button variant="contained" style={buttonStyle} onClick={confirmUpdate}>Update</Button>
        </>
    )
}

export default UpdateSpot