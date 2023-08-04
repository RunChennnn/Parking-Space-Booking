import React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Typography } from '@mui/material';

function DateTimePickerVal (props) {
  const typoStyle = {
    margin: '20px 15px 10px 0'
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="subtitle1" style={typoStyle} gutterBottom >Booking DateTime Picker</Typography>
      <DemoContainer components={['StartTimePicker', 'EndTimePicker']}>
        <DateTimePicker id='start-time-picker'
          label="StartTimePicker"
          value={props.start}
          onChange={(newTime) => props.changeStart(newTime)}/>
        <DateTimePicker id='end-time-picker'
          label="EndTimePicker"
          value={props.end}
          onChange={(newTime) => props.changeEnd(newTime)}/>
      </DemoContainer>
    </LocalizationProvider>
  )
}
export default DateTimePickerVal
