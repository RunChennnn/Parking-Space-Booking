import React from 'react'
import makeRequest from "../utilities/makeRequest";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from './NavigationBar';

function SpotUseOwner() {

  const navigate = useNavigate()
  const params = useParams();
    
  return (
    <>
      <NavigationBar />
      Spot use page for booking with ID {params.bookingID} from the perspective of the owner
    </>
  )
}
export default SpotUseOwner