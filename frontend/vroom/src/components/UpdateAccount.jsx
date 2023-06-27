import React from "react"
import { useParams } from 'react-router-dom'
import NavigationBar from "./NavigationBar"

function UpdateAccount () {

  const params = useParams()
  
  return (
    <>  
      <NavigationBar />
      <p>
        TODO update account page (account for user id {params.userID})
      </p>
    </>
  )
}

export default UpdateAccount