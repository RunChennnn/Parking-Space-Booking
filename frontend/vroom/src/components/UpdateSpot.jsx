import React from "react"
import { useParams } from 'react-router-dom'

function UpdateSpot () {

    const params = useParams()
    
    return (
        <>  
            <p>
                TODO update spot page (for spot id {params.spotID})
            </p>
        </>
    )
}

export default UpdateSpot