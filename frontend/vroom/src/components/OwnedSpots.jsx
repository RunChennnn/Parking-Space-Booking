import React from "react"
import { useParams } from 'react-router-dom'

function OwnedSpots () {

    const params = useParams()
    
    return (
        <>  
            <p>
                TODO owned spots page (for user id {params.userID})
            </p>
        </>
    )
}

export default OwnedSpots