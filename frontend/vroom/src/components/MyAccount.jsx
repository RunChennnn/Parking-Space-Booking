import React from "react"
import { useParams } from 'react-router-dom'

function MyAccount () {

    const params = useParams()
    
    return (
        <>  
            <p>
                TODO my account page (account for user id {params.userID})
            </p>
        </>
    )
}

export default MyAccount