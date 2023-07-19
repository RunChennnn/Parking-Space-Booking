import React from "react";
import makeRequest from "../utilities/makeRequest";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";

function ConfirmBookingDialog(props) {

    const navigate = useNavigate()

    const handleClose = () => {
        props.setOpen(false)
    }

    async function onConfirm() {
        await makeRequest('POST', `book/${props.confirmReq.spotID}/confirm`, props.confirmReq)
        navigate(`/account/${localStorage.getItem('vroom-id')}`)
    }

    function formatPrice (price) {
        return `$${Number(price).toFixed(2)}`
    }

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirming Booking"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    The total cost is {formatPrice(props.price)}, make sure you confirm booking
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">Cancel</Button>
                <Button onClick={onConfirm} color="primary" autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmBookingDialog