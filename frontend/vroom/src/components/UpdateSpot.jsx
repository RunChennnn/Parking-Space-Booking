import React from "react"
import { useParams } from 'react-router-dom'
import SpotNavigationBar from "./SpotNavigationBar";
import {Button} from "@mui/material";
import makeRequest from "../utilities/makeRequest";

function UpdateSpot () {

    const params = useParams()

    const buttonStyle = {
        margin: '20px 30% 0 30%'
    }

    function confirmUpdate() {

    }

    return (
        <>
            <SpotNavigationBar />
            <Button variant="contained" style={buttonStyle} onClick={confirmUpdate}>Register</Button>
        </>
    )
}

export default UpdateSpot