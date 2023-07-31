import React from 'react';
import makeRequest from '../utilities/makeRequest';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ConfirmBookingDialog (props) {
  const navigate = useNavigate()

  const handleClose = () => {
    props.setOpen(false)
  }

  async function onConfirm () {
    await makeRequest('POST', `book/${props.confirmReq.spotID}/confirm`, props.confirmReq)
    navigate(`/account/${localStorage.getItem('vroom-id')}`)
  }

  function formatPrice (price) {
    return `$${Number(price).toFixed(2)}`
  }

  console.log(props);

  return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{'Confirming Booking'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This booking will cost {formatPrice(props.surgedPrice)}. {props.surgedPrice === props.regularPrice && <>This has been increased by {formatPrice(props.surgedPrice - props.regularPrice)} by surge pricing. </>} Do you wish to confirm this booking?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button id='cancel-confirm-button' onClick={handleClose} color="error">Cancel</Button>
                <Button id='confirm-confirm-button' onClick={onConfirm} color="primary" autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
  )
}
export default ConfirmBookingDialog
