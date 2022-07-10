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
import DateFnsUtils from '@date-io/date-fns';
import { Autocomplete, TextField, Snackbar } from '@mui/material';
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import { buildBarChart, buildColumns } from '../../utils/utils';
import Fade from '@mui/material/Fade';
import BarChartSkeleton from "../../components/Skeletons/BarChartSkeleton";
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
const format_name = (name : string) => name.length < 13 ? name : `${name.slice(0, 13)}...`;

const chart_builder = {
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

interface MetricsByFileProps {
  iframe: boolean;
} 

const MetricsByFile = ({ iframe }: MetricsByFileProps) => {
  const initialDate = new Date();
  const classes = useStyles();

  const [files, setFiles] = useState<any>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [fileChartsFromDate, setFileChartsFromDate] = useState<Date | null>(initialDate);
  const [fileChartsToDate, setFileChartsToDate] = useState<Date | null>(initialDate);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string | null>('');

  // Metrics data
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
        group_by: undefined,
        // @ts-ignore
        time_charts_from: undefined, 
        // @ts-ignore
        time_charts_to: undefined, 
        // @ts-ignore
        file_charts_from: fileChartsFromDate?.toString() !== 'Invalid Date' && different_dates(fileChartsFromDate, fileChartsToDate) ? fileChartsFromDate?.valueOf() : undefined, 
        // @ts-ignore
        file_charts_to: fileChartsToDate?.toString() !== 'Invalid Date' && different_dates(fileChartsToDate, fileChartsFromDate) ? fileChartsToDate?.valueOf() : undefined
      }

      setMetrics(await fetch_by_path('metrics', { params }));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileChartsFromDate, fileChartsToDate, selectedFiles]);

  useEffect(() => {
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

  return (
    <>
      <Grid item className="p-2" container direction='column' style={iframe ? { width: '100%', height: '100%' } : {}}>
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
      <Snackbar open={open} onClose={() => closeSnackbar()} TransitionComponent={Fade} key={`${new Date()}`}>
        <SnackbarContent
          style={{ background: "#FFFFFF", borderColor: "#1C3B72", borderWidth: "55px", color: "#1C3B72" }}
          message={
            msg
          }
        />
      </Snackbar>
    </>
  );
}

export default MetricsByFile;