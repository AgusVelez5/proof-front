import React from "react";
import { Grid } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from "@material-ui/core/styles";
import esLocale from "date-fns/locale/es";

const useStyles = makeStyles({
  date_picker: {
    width: '145px'
  }
});

const get_formatted_date = (base_date?:Date | null) => {
  if (!base_date)
    base_date = new Date()
  return `${base_date.getDate() < 10 ? '0' : ''}${base_date.getDate()}/${(base_date.getMonth() + 1) < 10 ? '0' : ''}${base_date.getMonth() + 1}/${base_date.getFullYear()}`;
}

interface DateRangeFilterProps {
  initialDate: Date;
  fromDate: Date;
  toDate: Date;
  setFromDate: any; 
  setToDate: any;
} 

const DateRangeFilter = ({ initialDate, fromDate, toDate, setFromDate, setToDate }: DateRangeFilterProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs container justifyContent="flex-end">
        <MuiPickersUtilsProvider locale={esLocale} utils={DateFnsUtils}>
          <KeyboardDatePicker
            variant="inline"
            inputVariant="standard"
            label="Desde"
            format="dd/MM/yyyy"
            invalidDateMessage="Formato Dia/Mes/Año"
            disableFuture={true}
            maxDate={toDate}
            maxDateMessage={`'Desde' no puede ser mayor que 'Hasta'`}
            value={fromDate}
            InputAdornmentProps={{ position: "end" }}
            onChange={date => setFromDate(date || initialDate)}
            className={classes.date_picker}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider locale={esLocale} utils={DateFnsUtils}>
          <KeyboardDatePicker
            variant="inline"
            inputVariant="standard"
            label="Hasta"
            format="dd/MM/yyyy"
            invalidDateMessage="Formato Dia/Mes/Año"
            disableFuture={true}
            minDate={fromDate}
            minDateMessage={`'Hasta' no puede ser menor que 'Desde'`}
            maxDateMessage={`No puede ser mayor a ${get_formatted_date()}`}
            value={toDate}
            InputAdornmentProps={{ position: "end" }}
            onChange={date => setToDate(date || initialDate)}
            className={classes.date_picker}
            style={{ marginLeft: '20px'}}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    </>
  );
}

export default DateRangeFilter;
