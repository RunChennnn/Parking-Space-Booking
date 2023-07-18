import React from "react";
import makeRequest from "../utilities/makeRequest";
import {useNavigate, useParams} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

function UpcomingBooking() {

    const params = useParams()
    const navigate = useNavigate()

    // spot address
    const [address, setAddress] = React.useState('')
    // renting price
    const [price, setPrice] = React.useState('')

    // booking time()
    const [startTime, setStartTime] = React.useState('')
    const [endTime, setEndTime] = React.useState('')

    const [dialogVisible, setDialogVisible] = React.useState(false)

    const buttonStyle = {
        margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
        width: '100px'
    }

    const timeStampToDate = (timeStamp) => {
        const date = new Date(timeStamp)
        const dateFormat = date.toDateString() + ", " + date.getHours() + ":" + date.getMinutes()
        return dateFormat
    }


    async function loadingBookingDetails() {
        const res = await makeRequest('GET', `/booking/${params.bookingID}`, {})
        const booking = res.data

        const address = booking.streetNumber + " " + booking.streetName + " " + booking.suburb + " " + booking.postcode
        setAddress(address)

        const startTime = timeStampToDate(booking.startTime)
        const endTime = timeStampToDate(booking.endTime)

        setStartTime(startTime)
        setEndTime(endTime)

    }

    React.useEffect(()=>{
        loadingBookingDetails().then(r => {})
    },[])


    const handleClose = () => {
        setDialogVisible(false)
    }

    const handleClickOpen = () => {
        setDialogVisible(true)
    }

    async function confirmCancel() {
        const res = await makeRequest('DELETE', `booking/${params.bookingID}`)
        if(res.error) {
            alert("fail to cancel")
            handleClose()
        }
        else {
            handleClose()
            navigate(`/account/${localStorage.getItem('vroom-id')}`)
        }

    }

    return (
        <>
            <NavigationBar/>
            <Button variant="outlined" style={buttonStyle} onClick={handleClickOpen} color="error">CANCEL</Button>
            <Dialog
                open={dialogVisible}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Cancel booking confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Make sure you wanna to cancel this booking
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={confirmCancel} color="error" autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default UpcomingBooking
