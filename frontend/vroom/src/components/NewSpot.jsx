import React from "react"
import SpotNavigationBar from "./SpotNavigationBar";
import {useParams} from "react-router-dom";
import makeRequest from "../utilities/makeRequest";
import {Button} from "@mui/material";

function NewSpot () {

    const params = useParams()

    const buttonStyle = {
        margin: '20px 30% 0 30%'
    }

    function confirmRegister() {

    }
    
    return (
        <>
            <SpotNavigationBar />
            <Button variant="contained" style={buttonStyle} onClick={confirmRegister}>Register</Button>
        </>
    )
}

export default NewSpot