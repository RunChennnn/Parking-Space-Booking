import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

function SpotDetails() {

    const navigate = useNavigate();

    return(
        <>
            The detail info of spot
        </>
    )
}
export default SpotDetails