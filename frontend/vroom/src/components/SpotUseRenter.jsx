import React from "react"
import NavigationBar from "./NavigationBar"
import { useParams } from "react-router-dom"
import makeRequest from "../utilities/makeRequest";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function SpotUseRenter() {
  const params = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = React.useState('')
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [revenue, setRevenue] = React.useState(0)
  const [feedback, setFeedback] = React.useState('')

  const timeStampToDate = (timeStamp) => {
    const date = dayjs.unix(timeStamp).format('ddd, MMM D, YYYY h:mm A')
    return date
  }

  async function loadingSpotUseDetails() {

  }

  React.useEffect(() => {
      loadingSpotUseDetails().then(r => {})
  }, [])
    
  return (
    <>
      <NavigationBar />
      Spot use page for booking with ID {params.bookingID} from the perspective of the renter
    </>
  )
}

export default SpotUseRenter