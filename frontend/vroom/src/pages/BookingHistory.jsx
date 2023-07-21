import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useParams } from 'react-router-dom'

function BookingHistory () {
  const params = useParams();

  return (
    <>
      <NavigationBar />
      Booking history for user {params.userID}
    </>
  )
}

export default BookingHistory
