import React from "react"
import NavigationBar from "./NavigationBar"

function SpotSearch () {

  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get('token'))
    
  return (
    <>
      <NavigationBar />
      Spot search page, with token {urlParams.get('token')}. E.g. use the URL http://localhost:3000/search?token=28736. We can add more parameters to this URL if we need them.
    </>
  )
}

export default SpotSearch