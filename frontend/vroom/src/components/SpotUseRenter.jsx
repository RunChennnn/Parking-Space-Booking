<<<<<<< HEAD
import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"

function SpotUseRenter () {

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Spot use page for booking with ID {params.bookingID} from the perspective of the renter
    </>
  )
}

=======
import React from "react";
import makeRequest from "../utilities/makeRequest";
import {useNavigate} from "react-router-dom";

function SpotUseRenter() {
    const navigate = useNavigate()
    return (
        <></>
    )
}
>>>>>>> run-sprint2
export default SpotUseRenter