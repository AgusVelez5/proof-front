import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  ButtonGroup,
  Card,
  CardContent
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import { buildSeries, buildLineChart } from '../../utils/utils';
import LineChartSkeleton from "../Skeletons/LineChartSkeleton";
import Typography from '@material-ui/core/Typography';
import esLocale from "date-fns/locale/es";

const useStyles = makeStyles({
  textField: {
    "& label": {
      marginTop: -3
    }
  },
  label: {
    display: "flex",
    alignItems: "space-between"
  },
  card: {
    borderRadius: 16,
    boxShadow: "0px 3px 6px #00000029",
    marginTop: "12px"
  },
  title: {
    fontSize: "20px", 
    fontWeight: 400, 
    color: "#707070"
  },
  date_picker: {
    width: '145px'
  }
});

Highcharts.setOptions({
  lang: {
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    weekdays: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles',
      'Jueves', 'Viernes', 'Sábado'
    ],
    shortMonths: [
      'Ene', 'Feb', 'Mar','Abr',
      'May', 'Jun', 'Jul', 'Ago',
      'Sep', 'Oct', 'Nov', 'Dic'
    ],
    resetZoom: 'Restablecer zoom'
  }
});

const fetch_by_path = async (path:string, params: any = {}) => (await axios.get(`${BACK_URL}/api/${path}`, { ...params })).data.data;

const get_formatted_date = (base_date?:Date | null) => {
  if (!base_date)
    base_date = new Date()
  return `${base_date.getDate() < 10 ? '0' : ''}${base_date.getDate()}/${(base_date.getMonth() + 1) < 10 ? '0' : ''}${base_date.getMonth() + 1}/${base_date.getFullYear()}`;
}

const different_dates = (date1: Date, date2: Date) => date1.valueOf() !== date2.valueOf();

const chart_builder = {
  stamps: ({ metrics } : any) => buildLineChart(null, buildSeries({ metrics: !metrics ? [] : metrics.stamps, name: 'Archivos Estampados', key: 'stamps_number' })),
  verifications: ({ metrics } : any) => buildLineChart(null, buildSeries({ metrics: !metrics ? [] : metrics.verifications, name: 'Archivos Verificados', key: 'verifications_number' })),
  downloads: ({ metrics } : any) => buildLineChart(null, buildSeries({ metrics: !metrics ? [] : metrics.proofs, name: 'Archivos Descargados', key: 'proofs_number' }))
}

const ChartWrapper = ({ children } : { children: React.ReactNode }) => {
  return (
    <Grid item xs style={{ position: 'relative', width: '100%', height: '420px' }}>
      <Grid item xs className="p-1" style={{ position: 'absolute', width: '100%' }}>
        {children}
      </Grid>
    </Grid>
  );
}

interface MetricsByTimeProps {
  iframe: boolean;
} 

const MetricsByTime = ({ iframe }: MetricsByTimeProps) => {
  const initialDate = new Date();
  const classes = useStyles();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [timeChartsFromDate, setTimeChartsFromDate] = useState<Date | null>(initialDate);
  const [timeChartsToDate, setTimeChartsToDate] = useState<Date | null>(initialDate);
  const [groupBy, setGroupBy] = useState<string>('1d');

  // Metrics data
  const [stampsData, setStampsData] = useState<any>({});
  const [verificationsData, setVerificationsData] = useState<any>({});
  const [downloadsData, setDownloadsData] = useState<any>({});

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetch_by_path('metrics').then(r => {
          setMetrics(r)
        })
      ]).then(_ => {
        setLoading(false)
      })
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const params: any = { 
        group_by: groupBy,
        // @ts-ignore
        time_charts_from: timeChartsFromDate?.toString() !== 'Invalid Date' && different_dates(timeChartsFromDate, timeChartsToDate) ? timeChartsFromDate?.valueOf() : undefined, 
        // @ts-ignore
        time_charts_to: timeChartsToDate?.toString() !== 'Invalid Date' && different_dates(timeChartsToDate, timeChartsFromDate) ? timeChartsToDate?.valueOf() : undefined, 
        // @ts-ignore
        file_charts_from: undefined, 
        // @ts-ignore
        file_charts_to: undefined
      }

      setMetrics(await fetch_by_path('metrics', { params }));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, timeChartsFromDate, timeChartsToDate]);

  useEffect(() => {
    setStampsData(chart_builder.stamps({ metrics }));
    setVerificationsData(chart_builder.verifications({ metrics }));
    setDownloadsData(chart_builder.downloads({ metrics }));
  }, [metrics]);

  const get_selected_time_unit = (condition : string) => ({ fontSize: "15px", ...(groupBy === condition ? { fontWeight: 700, color: "#848484" } : { fontWeight: 400, color: "#C3C3C3"})});

  return (
    <Grid item className="p-2" container direction='column' style={iframe ? { width: '100%', height: '100%' } : {}}>
      <Grid item container direction='row' style={{ padding: '0px 15px 0px 15px'}}>
        <Grid item xs container alignItems="flex-end">
          <Typography style={{ fontSize: "20px", fontWeight: 700, color: "#848484", marginRight: '15px', marginBottom: '3px' }} >
            Unidad de tiempo
          </Typography>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button onClick={()=> setGroupBy('1d')}>
              <Typography style={get_selected_time_unit('1d')} >
                Día
              </Typography>
            </Button>
            <Button onClick={()=> setGroupBy('30d')}>
              <Typography style={get_selected_time_unit('30d')} >
                Mes
              </Typography>
            </Button>
            <Button onClick={()=> setGroupBy('180d')}>
              <Typography style={get_selected_time_unit('180d')} >
                Semestre
              </Typography>
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs container justifyContent="flex-end">
          <MuiPickersUtilsProvider locale={esLocale} utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              inputVariant="standard"
              label="Desde"
              format="dd/MM/yyyy"
              invalidDateMessage="Formato Dia/Mes/Año"
              disableFuture={true}
              maxDate={timeChartsToDate}
              maxDateMessage={`'Desde' no puede ser mayor que 'Hasta'`}
              value={timeChartsFromDate}
              InputAdornmentProps={{ position: "end" }}
              onChange={date => setTimeChartsFromDate(date)}
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
              minDate={timeChartsFromDate}
              minDateMessage={`'Hasta' no puede ser menor que 'Desde'`}
              maxDateMessage={`No puede ser mayor a ${get_formatted_date()}`}
              value={timeChartsToDate}
              InputAdornmentProps={{ position: "end" }}
              onChange={date => setTimeChartsToDate(date)}
              className={classes.date_picker}
              style={{ marginLeft: '20px'}}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Card variant="outlined" className={classes.card}>
        <CardContent>
        {loading ?
          <Grid item xs container direction="row" className="p-2" justifyContent="center" alignItems="center">
            <Grid item xs container className="p-top-3" justifyContent="center" alignItems="center">
              <LineChartSkeleton style={{ width: '65%', height: 'auto' }} />
            </Grid>
            <Grid item xs container className="p-top-3" justifyContent="center" alignItems="center">
              <LineChartSkeleton style={{ width: '65%', height: 'auto' }} />
            </Grid>
            <Grid item xs container className="p-top-3" justifyContent="center" alignItems="center">
              <LineChartSkeleton style={{ width: '65%', height: 'auto' }} />
            </Grid>
          </Grid>
            : 
          <Grid item xs container direction="row" className="p-2" justifyContent="center" alignItems="center" >
            <ChartWrapper>
              <Typography className={classes.title} >
                Archivos Estampados
              </Typography>
              <HighchartsReact highcharts={Highcharts} options={stampsData} allowChartUpdate={true} containerProps={{ style: { height: "100%" } }}/>
            </ChartWrapper>
            <ChartWrapper>
              <Typography className={classes.title} >
                Archivos Verificados
              </Typography>
              <HighchartsReact highcharts={Highcharts} options={verificationsData} allowChartUpdate={true} containerProps={{ style: { height: "100%" } }}/>
            </ChartWrapper>
            <ChartWrapper>
              <Typography className={classes.title} >
                Archivos Descargados
              </Typography>
              <HighchartsReact highcharts={Highcharts} options={downloadsData} allowChartUpdate={true} containerProps={{ style: { height: "100%" } }}/>
            </ChartWrapper>
          </Grid>
        }
        </CardContent>
      </Card>
    </Grid>
  );
}

export default MetricsByTime;