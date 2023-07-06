import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"

function SpotDetails () {

  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Spot details page for spot with ID {params.spotID}
    </>
  )
}

export default SpotDetails