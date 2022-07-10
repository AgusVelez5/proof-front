import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  ButtonGroup,
  Card,
  CardContent
} from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./MetricsPage.css";
import DateFnsUtils from '@date-io/date-fns';
import { Autocomplete, TextField, Snackbar } from '@mui/material';
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Highcharts, { reduce } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import { buildSeries, buildLineChart, buildBarChart, buildColumns } from '../../utils/utils';
import Fade from '@mui/material/Fade';
import BarChartSkeleton from "../../components/Skeletons/BarChartSkeleton";
import LineChartSkeleton from "../../components/Skeletons/LineChartSkeleton";
import Typography from '@material-ui/core/Typography';
import esLocale from "date-fns/locale/es";
import { useSnackbar } from "notistack";

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

const format_name = (name : string) => name.length < 13 ? name : `${name.slice(0, 13)}...`;

const chart_builder = {
  stamps: ({ metrics } : any) => buildLineChart(null, buildSeries({ metrics: !metrics ? [] : metrics.stamps, name: 'Archivos Estampados', key: 'stamps_number' })),
  verifications: ({ metrics } : any) => buildLineChart(null, buildSeries({ metrics: !metrics ? [] : metrics.verifications, name: 'Archivos Verificados', key: 'verifications_number' })),
  downloads: ({ metrics } : any) => buildLineChart(null, buildSeries({ metrics: !metrics ? [] : metrics.proofs, name: 'Archivos Descargados', key: 'proofs_number' })),
  downloads_by_file: ({ selectedFiles, metrics } : any) => buildBarChart(null, selectedFiles.map((n: any) => format_name(n)), buildColumns({metrics: !metrics ? [] : metrics.proofs_by_file.filter((d:any) => selectedFiles.indexOf(d.file_name) !== -1), name: 'Descargas por archivo', key: 'proofs_number' })),
  verifications_by_file: ({ selectedFiles, metrics } : any) => buildBarChart(null, selectedFiles.map((n: any) => format_name(n)), buildColumns({ metrics: !metrics ? [] : metrics.verifications_by_file.filter((d:any) => selectedFiles.indexOf(d.file_name) !== -1), name: 'Verificaciones por archivo', key: 'verifications_number' })),
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

const MetricsPage = () => {
  const classes = useStyles();

  const [files, setFiles] = useState<any>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [timeChartsFromDate, setTimeChartsFromDate] = useState<Date | null>(null);
  const [timeChartsToDate, setTimeChartsToDate] = useState<Date | null>(null);
  const [fileChartsFromDate, setFileChartsFromDate] = useState<Date | null>(null);
  const [fileChartsToDate, setFileChartsToDate] = useState<Date | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [groupBy, setGroupBy] = useState<string>('1d');
  const [searchValue, setSearchValue] = useState<string | null>('');

  // Metrics data
  const [stampsData, setStampsData] = useState<any>({});
  const [verificationsData, setVerificationsData] = useState<any>({});
  const [downloadsData, setDownloadsData] = useState<any>({});
  const [downloadsByFileData, setDownloadsDataByFile] = useState<any>({});
  const [verificationsByFileData, setVerificationsDataByFile] = useState<any>({});

  // Snackbar
  const [state, setState] = useState({
    open: false,
    msg: ""
  });

  const { open, msg } = state;
  const openSnackbar = (msg:string) => setState({ open: true, msg });
  const closeSnackbar = () => setState({ ...state, open: false });

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetch_by_path('file_data').then(r => setFiles(r)),
        fetch_by_path('metrics').then(r => {
          setMetrics(r)
          setSelectedFiles(r.proofs_by_file.slice(0, 5).map((d:any) => d.file_name))
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
        time_charts_from: timeChartsFromDate?.toString() !== 'Invalid Date' && timeChartsFromDate !== null ? timeChartsFromDate?.valueOf() : undefined, 
        // @ts-ignore
        time_charts_to: timeChartsToDate?.toString() !== 'Invalid Date' && timeChartsToDate !== null ? timeChartsToDate?.valueOf() : undefined, 
        // @ts-ignore
        file_charts_from: fileChartsFromDate?.toString() !== 'Invalid Date' && fileChartsFromDate !== null ? fileChartsFromDate?.valueOf() : undefined, 
        // @ts-ignore
        file_charts_to: fileChartsToDate?.toString() !== 'Invalid Date' && fileChartsToDate !== null ? fileChartsToDate?.valueOf() : undefined
      }

      setMetrics(await fetch_by_path('metrics', { params }));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, timeChartsFromDate, timeChartsToDate, fileChartsFromDate, fileChartsToDate, selectedFiles]);

  useEffect(() => {
    setStampsData(chart_builder.stamps({ metrics }));
    setVerificationsData(chart_builder.verifications({ metrics }));
    setDownloadsData(chart_builder.downloads({ metrics }));
    setDownloadsDataByFile(chart_builder.downloads_by_file({ selectedFiles, metrics }));
    setVerificationsDataByFile(chart_builder.verifications_by_file({ selectedFiles, metrics}));
  }, [metrics, selectedFiles]);

  const updateSelectedFiles = (action:string) => {
    const searchedValue = searchValue
    const file = files.filter((f:any) => f.name === searchedValue) ? files.filter((f: any) => f.name === searchedValue)[0] : undefined
    setSearchValue('')

    if (!file)
      return openSnackbar("El archivo seleccionado no existe")

    if (action === "add")
      if (selectedFiles.length <= 5) {
        setSelectedFiles([...selectedFiles, searchedValue])
      }
      else
        return openSnackbar("Máximo 5 archivos")
    else 
      if (selectedFiles.length > 1)
        setSelectedFiles(selectedFiles.filter((f: string) => f !== searchedValue))
      else
        return openSnackbar("Mínimo un archivo")
  }

  const get_selected_time_unit = (condition : string) => ({ fontSize: "15px", ...(groupBy === condition ? { fontWeight: 700, color: "#848484" } : { fontWeight: 400, color: "#C3C3C3"})});

  return (
    <Scaffold>
      <Grid item container justifyContent="center" >
        <Grid item container direction='column'>
          <Grid item className="p-2" container direction='column'>
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
                    <HighchartsReact highcharts={Highcharts} options={stampsData} oneToOne={true} containerProps={{ style: { height: "100%" } }}/>
                  </ChartWrapper>
                  <ChartWrapper>
                    <Typography className={classes.title} >
                      Archivos Verificados
                    </Typography>
                    <HighchartsReact highcharts={Highcharts} options={verificationsData} oneToOne={true} containerProps={{ style: { height: "100%" } }}/>
                  </ChartWrapper>
                  <ChartWrapper>
                    <Typography className={classes.title} >
                      Archivos Descargados
                    </Typography>
                    <HighchartsReact highcharts={Highcharts} options={downloadsData} oneToOne={true} containerProps={{ style: { height: "100%" } }}/>
                  </ChartWrapper>
                </Grid>
              }
              </CardContent>
            </Card>
          </Grid>
          <Grid item className="p-2" container direction='column' >
            <Grid container style={{ padding: '0px 15px 0px 15px'}}>
              <Grid item xs={3} lg={4} container>
                <Autocomplete
                  style={{ minWidth:"60%" }}
                  freeSolo
                  autoSelect
                  options={files.map((file:any) => file.name)}
                  onChange={(event, value:string | null) => setSearchValue(value)}
                  value={searchValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className={classes.textField}
                      label={
                        <div className={classes.label}>
                          <SearchIcon />
                          <span>Buscar</span>
                        </div>
                      }
                      InputProps={{
                        ...params.InputProps
                      }}
                    />
                  )}
                />
                <ButtonGroup variant="text" aria-label="text button group">
                  <Button onClick={() => updateSelectedFiles('add')}><strong>+</strong></Button>
                  <Button onClick={() => updateSelectedFiles('remove')}><strong>-</strong></Button> 
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
                    maxDate={fileChartsToDate}
                    maxDateMessage={`'Desde' no puede ser mayor que 'Hasta'`}
                    value={fileChartsFromDate}
                    InputAdornmentProps={{ position: "end" }}
                    onChange={date => setFileChartsFromDate(date)}
                    className={classes.date_picker}
                  />
                  <KeyboardDatePicker
                    variant="inline"
                    inputVariant="standard"
                    label="Hasta"
                    format="dd/MM/yyyy"
                    invalidDateMessage="Formato Dia/Mes/Año"
                    disableFuture={true}
                    minDate={fileChartsFromDate}
                    minDateMessage={`'Hasta' no puede ser menor que 'Desde'`}
                    maxDateMessage={`No puede ser mayor a ${get_formatted_date()}`}
                    value={fileChartsToDate}
                    InputAdornmentProps={{ position: "end" }}
                    onChange={date => setFileChartsToDate(date)}
                    className={classes.date_picker}
                    style={{ marginLeft: '20px'}}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.card}> 
              <CardContent>
                <Grid item xs container direction="row" className="p-2" justifyContent="center" alignItems="center">
                  {loading ?
                    <>
                      <Grid item xs container justifyContent="center" alignItems="center" className="p-3">
                        <BarChartSkeleton style={{ width: '50%', height: 'auto' }} />
                      </Grid>
                      <Grid item xs container justifyContent="center" alignItems="center" className="p-3">
                        <BarChartSkeleton style={{ width: '50%', height: 'auto' }} />
                      </Grid>
                    </>
                      : 
                    <>
                      <ChartWrapper>
                        <Typography className={classes.title} >
                          Verificaciones por archivo
                        </Typography>
                        <HighchartsReact highcharts={Highcharts} options={verificationsByFileData}/>
                      </ChartWrapper>
                      <ChartWrapper>
                        <Typography className={classes.title} >
                          Descargas por archivo
                        </Typography>
                        <HighchartsReact highcharts={Highcharts} options={downloadsByFileData}/>
                      </ChartWrapper>
                    </>
                  }
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={open} onClose={() => closeSnackbar()} TransitionComponent={Fade} key={`${new Date()}`}>
        <SnackbarContent
          style={{ background: "#FFFFFF", borderColor: "#1C3B72", borderWidth: "55px", color: "#1C3B72" }}
          message={
            msg
          }
        />
      </Snackbar>
    </Scaffold>
  );
}

export default MetricsPage;