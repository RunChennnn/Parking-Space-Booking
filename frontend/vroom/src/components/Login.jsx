import React from "react"
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Login () {
    
    const navigate = useNavigate();

    return (
        <>  
            <p>
                TODO login page
            </p>
            <Button variant="contained" onClick={() => navigate("/register")}>Register</Button>
        </>
    )
}

export default Login