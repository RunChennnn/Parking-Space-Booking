import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"

function SpotUseOwner () {

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Spot use page for booking with ID {params.bookingID} from the perspective of the owner
    </>
  )
}

export default SpotUseOwner