import React from "react"
import { useParams } from 'react-router-dom'

function UpdateAccount () {

    const params = useParams()
    
    return (
        <>  
            <p>
                TODO update account page (account for user id {params.userID})
            </p>
        </>
    )
}

export default UpdateAccount