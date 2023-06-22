import React from "react"
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Register () {
    const navigate = useNavigate();
    return (
        <>
            <p>
                TODO register page
            </p>
            <Button variant="contained" onClick={() => navigate("/login")}>Login</Button>
        </>
    )
}

export default Register