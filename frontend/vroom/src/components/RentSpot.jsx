import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"

function RentSpot () {

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Rent spot page for spot with ID {params.spotID}
    </>
  )
}

export default RentSpot