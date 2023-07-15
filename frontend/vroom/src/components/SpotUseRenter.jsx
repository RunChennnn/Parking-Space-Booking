import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import {useNavigate} from "react-router-dom";

function SpotUseRenter() {
  const navigate = useNavigate()

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Spot use page for booking with ID {params.bookingID} from the perspective of the renter
    </>
  )
}

export default SpotUseRenter