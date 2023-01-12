import React, { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import ja from "date-fns/locale/ja";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import "./DatePicker.css"

export const SimpleDatePicker = (props) => {
  const { value, endValue, setValue, setEndValue } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="開始予定日"
        value={value}
        onChange={(newValue) => {
          setValue(newValue.toDate());
        }}
        renderInput={(params) => <TextField {...params} />}
        className="startDate"
      />
      <DatePicker
        label="完了予定日"
        value={endValue}
        onChange={(newValue) => {
          setEndValue(newValue.toDate());
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}