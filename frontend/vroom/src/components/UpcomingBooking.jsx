import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"

function UpcomingBooking () {

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Upcoming booking page for booking with ID {params.bookingID}
    </>
  )
}

export default UpcomingBooking