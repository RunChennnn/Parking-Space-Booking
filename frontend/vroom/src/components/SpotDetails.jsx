import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

function SpotDetails() {

    const navigate = useNavigate()

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Spot details page for spot with ID {params.spotID}
    </>
  )
}

export default SpotDetails