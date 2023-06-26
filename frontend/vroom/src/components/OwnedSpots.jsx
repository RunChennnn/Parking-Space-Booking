import React from "react"
import {useNavigate, useParams} from 'react-router-dom'
import {Table, Button, Typography} from '@mui/material'
import SpotNavigationBar from './SpotNavigationBar'
import makeRequest from "../utilities/makeRequest";


function OwnedSpots () {

    const params = useParams()

    const navigate = useNavigate()
    
    const buttonStyle = {
        margin: '20px 30% 0 30%'
    }



    const itemColumn = [{},{},{},{}]

    function toRegisterSpot() {
        navigate('/spots/new')
    }
    
    return (
        <>  
            <div>
              <SpotNavigationBar />
              <Typography align="center" variant="h4">Owned Spots</Typography>
              <Table />
              <Button variant="contained" style={buttonStyle} onClick={toRegisterSpot}>Register new spot</Button>
            </div>
        </>
    )
}

export default OwnedSpots