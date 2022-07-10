import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Button
} from "@material-ui/core";
import { Card, CardContent } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import Fade from '@mui/material/Fade';
import { TextField } from '@mui/material';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import SearchIcon from '@mui/icons-material/Search';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiTableCell from "@material-ui/core/TableCell";
import TableSkeleton from "../../components/Skeletons/TableSkeleton";
import CustomIcon from "../Icon/Icon";
import AnimationHook from "../../hooks/AnimationHook/AnimationHook";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import esLocale from "date-fns/locale/es";
import Link from '@mui/material/Link';
import BatchDialog from "../BatchDialog/BatchDialog";
const { saveAs } = require("save-files");

const TableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell);

const useStyles = makeStyles({
    '@keyframes blinker': {
        from: { opacity: 1 },
        to: { opacity: 0 },
    },
  textField: {
    "& label": {
      marginTop: -3
    }
  },
  label: {
    display: "flex",
    alignItems: "space-between"
  },
  tableHead: {
    height: '64px',
    borderBottom: '5px solid #1C3B72'
  },
  button: { 
    background: "#FFFFFF 0% 0% no-repeat padding-box", 
    border: "1px solid #1C3B72",
    borderRadius: "13px", 
    fontSize: "14px", 
    color: '#1C3B72',
    textTransform: 'none', 
    height: "22px",
    width: "133px",
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': {
      color: '#FFFFFF',
      background: '#C3C3C3',
      border: "1px solid #C3C3C3",
    }, 
  },
  loading_button: { 
    background: "#FFFFFF 0% 0% no-repeat padding-box", 
    border: "1px solid #1C3B72",
    borderRadius: "13px", 
    fontSize: "14px", 
    color: '#1C3B72',
    textTransform: 'none', 
    height: "22px",
    width: "133px",
  },
  verified_button: {
    background: "#00B6E6 0% 0% no-repeat padding-box", 
    border: "1px solid #1C3B72",  
    borderRadius: "13px",
    fontSize: "14px", 
    textTransform: 'none', 
    height: "24px",
    width: "133px",
    color: '#FFFFFF',
  },
  verified_data: {
    animation: `$blinker 1s linear 8`,
  },
  date_picker: {
    width: '145px'
  }
});

interface Data {
  name: string;
  stamp_timestamp: string | Date;
  hash: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Data;
  label: string;
  align: "right" | "center" | "inherit" | "left" | "justify" | undefined;
}

const get_formatted_date = (base_date?:Date | null) => {
  if (!base_date)
    base_date = new Date()
  return `${base_date.getDate() < 10 ? '0' : ''}${base_date.getDate()}/${(base_date.getMonth() + 1) < 10 ? '0' : ''}${base_date.getMonth() + 1}/${base_date.getFullYear()}`;
}

const fetch_by_path = async (path:string, params: any = {}) => (await axios.get(`${BACK_URL}/api/${path}`, { params })).data.data
const verify_file = async (file_hash:string) => await fetch_by_path('verify', { hashes: file_hash })
const download_file = async (file_name:string, file_hash:string) => {
  saveAs(
    `${BACK_URL}/api/proof?hashes=${file_hash}`,
    `${file_name}.zip`,
    { autoBom: false, cors: false }
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy])
    return -1;
  if (b[orderBy] > a[orderBy])
    return 1;
  return 0;
}

function getComparator<Key extends keyof any>(order: Order, orderBy: Key,): (a: { [key in Key]: number | string | Date }, b: { [key in Key]: number | string | Date },) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number, verifiedFiles : any) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0])
  //return [ ...foo.filter((r:any) => verifiedFiles[r.hash] !== undefined), ...foo.filter((r:any) => verifiedFiles[r.hash] === undefined) ];
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    align: 'left',
    label: 'Nombre',
  },
  {
    id: 'stamp_timestamp',
    align: 'center',
    label: 'Fecha de subida',
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  selectedRows: Data[];
  setVerified: any;
  iframe: boolean;
}

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selectedRows, setVerified, iframe }: EnhancedTableProps) {
  const classes = useStyles();
  const rows_hashes = selectedRows.map((r:any) => r.hash)

  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const handleVerifications = async () => {
    const res = (await Promise.all(rows_hashes.map((r:any) => verify_file(r)))).map((r:any) => r[0]);
    setVerified(rows_hashes, res);
  }

  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={ numSelected > 0 }
            onChange={onSelectAllClick}
            style={{ color: "#C3C3C3" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography className="montserrat-font" style={{ color: "#1C3B72", fontSize: "20px", fontWeight: 700 }} >
                {headCell.label.toUpperCase()}
              </Typography>
              {orderBy === headCell.id ? (
                // @ts-ignore
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>
          <Fade in={numSelected > 0 && iframe} timeout={500}>
            <div>
              <IconButton style={{ color: "#C3C3C3" }} onClick={() => handleVerifications()}>
                <GradingOutlinedIcon />
              </IconButton>
              <IconButton style={{ color: "#C3C3C3" }} onClick={async () => await download_file(`archivos_${get_formatted_date(new Date())}`, rows_hashes.join(','))}>
                <DownloadOutlinedIcon/>
              </IconButton>
            </div>
          </Fade>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

// @ts-ignore
const Row = ({ row, isSelected, index, handleClick, verification, setVerification }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const isItemSelected = isSelected(row.name);
  const [verificationLoading, setVerificationLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [downloadHover, setDownloadHover] = useState<boolean>(false);

  const verifyCellReference = useRef();
  const [verifyCellDimensions, setVerifyCellDimensions] = useState({ width: 0, height: 0 });

  const handleResize = () => {
    setVerifyCellDimensions({
      // @ts-ignore
      width: verifyCellReference.current.offsetWidth,
      // @ts-ignore
      height: verifyCellReference.current.offsetHeight
    });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    setTimeout(() => handleResize(), 0 );
  }, []);

  const handleVerification = async (e : any, row : any) => {
    e.stopPropagation()
    try {
      setVerificationLoading(true);
      const result = await verify_file(row.hash);
      setVerification(row.hash, result[0]);
      setVerificationLoading(false);
      setOpen(true);
    } catch (e) {
      console.log(e)
    }
  }

  // @ts-ignore
  const handleDownload = async (name, hash) => {
    setDownloadLoading(true);
    await download_file(name, hash);
    setDownloadLoading(false);
  }

  return (
    <>
      <TableRow
        hover
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.hash}
        selected={isItemSelected}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="none" style={{ minWidth: "90px", paddingLeft: "5px"}}>
          <Grid container style={{ height: "100%", width: "100%" }}>
            <Checkbox
              checked={isItemSelected}
              onClick={(event) => { 
                event.stopPropagation()
                handleClick(event, row.name)
              }}
              style={{ color: "#C3C3C3"}}
            />
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Grid>
        </TableCell>
        <TableCell component="th" scope="row" >
          <Typography style={{ color: "#272727", fontSize: "15px" }} >
            {row.name}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography style={{ color: "#272727", fontSize: "15px" }} >
            { row.stamped ? get_formatted_date(row.stamp_timestamp) : '--/--/--'}
          </Typography>
        </TableCell>
        <TableCell ref={verifyCellReference}>
          <AnimationHook isMounted={verification === false} delay={25}>
            <Button variant="outlined" className={classes.button} onClick={async (e) => await handleVerification(e, row)} disabled={!row.stamped}>
              {verificationLoading && <CircularProgress style={{ color: '#1C3B72' }} size={14} />}
              {!verificationLoading && 'Verificar'}
            </Button>
          </AnimationHook>
          <AnimationHook isMounted={verification !== false}>
            <Button variant="outlined" className={classes.verified_button} disabled={true} onClick={(e) => e.stopPropagation()} startIcon={<CheckCircleOutlineIcon style={{ color: "#FFFFFF" }} />}>
              <Typography className="montserrat-font" style={{ color: '#FFFFFF'}} >
                Verificado
              </Typography>
            </Button> 
          </AnimationHook>
        </TableCell>
      </TableRow>
      <TableRow key={`2-${row.hash}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container alignItems="center" justifyContent="space-between" style={{ paddingLeft: "95px", paddingRight: `${verifyCellDimensions.width - 133 - 32 }px`, paddingBottom: '8px', paddingTop: '8px'  }}>
              <Grid item>
                <Typography style={{ color: "#757575", fontSize: "15px" }} >
                  <strong>Hash asociado: </strong>{  row.stamped ? row.hash : '--'}
                </Typography>
                {verification !== false &&
                  <Typography className={classes.verified_data} style={{ color: "#757575", fontSize: "15px" }} >
                    <strong>Número de bloque:</strong> <Link href={`https://www.blockchain.com/btc/block/${verification?.proof?.height}`} target="_blank" rel="noreferrer" color="inherit" underline="hover">{verification?.proof?.height}</Link>
                  </Typography>
                }
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  className={classes.button} 
                  onMouseEnter={() => setDownloadHover(true) }
                  onMouseLeave={() => setDownloadHover(false) }
                  onClick={async () => await handleDownload(row.name, row.hash)}
                  startIcon={<CustomIcon path={`/assets/icons/${downloadHover ? 'download_white' : 'download' }.svg`} imgStyle={{ width: "70%", height: "70%", paddingTop: "3px" }} />} 
                >
                  {downloadLoading && <CircularProgress style={{ color: '#1C3B72' }} size={14} />}
                  {!downloadLoading && 'Descargar'}
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

interface VerificationListProps {
  files: any;
  rows_data: Data[];
  loading: boolean;
  iframe: boolean;
} 

const VerificationList = ({ files, rows_data, loading, iframe }: VerificationListProps) => {
  const classes = useStyles();
  const [openDialog, setDialogOpen] = useState<boolean>(false);
  const [filesVerified, setFilesVerified] = useState<any>({});
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fileChartsFromDate, setFileChartsFromDate] = useState<Date | null>(null);
  const [fileChartsToDate, setFileChartsToDate] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>('');

  rows_data = rows_data.map((r:any) => ({ name: r.name, hash: r.hash, stamp_timestamp: new Date(r.stamp_timestamp), stamped: r.stamped }))

  useEffect(() => {
    if (selected.length > 0 && !iframe)
      setDialogOpen(true)
    if (selected.length === 0 && !iframe)
      setDialogOpen(false)
  }, [selected]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = stableSort(rows_data, getComparator(order, orderBy), filesVerified)
                            .filter(r => from_date_filter(r.stamp_timestamp) && to_date_filter(r.stamp_timestamp))
                            .filter(r => searchValue === '' || searchValue === null ? true : r.name.toLowerCase().includes(searchValue.toLowerCase()))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((n:any) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleSingleVerification = (hash:any, data:any) => {
    const _filesVerified = { ...filesVerified };
    _filesVerified[hash] = data;
    setFilesVerified(_filesVerified);
  };

  const handleBatchVerification = (hashes:any, data:any) => {
    const _filesVerified = { ...filesVerified };
    for (let hash of hashes)
      _filesVerified[hash] = data.filter((d:any) => d.hash === hash)[0];
    setFilesVerified(_filesVerified);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const from_date_filter = (timestamp: string | Date) => fileChartsFromDate === null || fileChartsFromDate.toString() === 'Invalid Date' ? true : (fileChartsFromDate < new Date(timestamp)) || ((new Date(timestamp)).toISOString().slice(0, 10) === fileChartsFromDate.toISOString().slice(0, 10))
  const to_date_filter = (timestamp: string | Date) => fileChartsToDate === null || fileChartsToDate.toString() === 'Invalid Date' ? true : (new Date(timestamp) < fileChartsToDate) || ((new Date(timestamp)).toISOString().slice(0, 10) === fileChartsToDate.toISOString().slice(0, 10))

  return (
    <>
      <Grid container style={iframe ? { width: '100%', height: '100%' } : {}}>
        <Grid container className="m-bottom-3" alignContent="center" alignItems="center" style={{ padding: '0px 15px 0px 15px', backgroundColor: '#F2F2F2' }}>
          <Grid item xs={3} lg={4}>
            <TextField
              variant="standard"
              className={classes.textField}
              onChange={(event) => setSearchValue(event.target.value)}
              label={
                <div className={classes.label}>
                  <SearchIcon />
                  <span>Buscar</span>
                </div>
              }
              style={{ width: '100%'}}
            />
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
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider locale={esLocale} utils={DateFnsUtils}>
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
        <Grid container direction="column" style={{ backgroundColor: '#F2F2F2' }}>
          {loading ?
              <Card style={{ width: '100%', borderRadius: '17px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'}}>
                <CardContent>
                  <Grid container justifyContent="center" alignItems="center">
                    <TableSkeleton style={{ width: "100%" }}/>
                  </Grid>
                </CardContent>
              </Card>
            : 
              <>
                <TableContainer component={Paper} style={{borderRadius: '17px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'}}>
                  <Table aria-label="collapsible table" style={{ flexGrow: 1, flex: '1 1 auto', ...(files.length === 0 ? { height: '345px' } : {})}}>
                    <EnhancedTableHead
                          numSelected={selected.length}
                          selectedRows={rows_data.filter((r:any) => selected.includes(r.name))}
                          order={order}
                          orderBy={orderBy}
                          onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={rows_data.length}
                          setVerified={handleBatchVerification}
                          iframe={iframe}
                        />
                    <TableBody>
                      {stableSort(rows_data, getComparator(order, orderBy), filesVerified)
                            .filter(r => from_date_filter(r.stamp_timestamp) && to_date_filter(r.stamp_timestamp))
                            .filter(r => searchValue === '' || searchValue === null ? true : r.name.toLowerCase().includes(searchValue.toLowerCase()))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => 
                              <Row 
                                row={row} 
                                index={index} 
                                key={row.hash} 
                                isSelected={(name:string) => isSelected(name)} 
                                verification={filesVerified[row.hash] ? filesVerified[row.hash] : false} 
                                setVerification={(hash:string, data:any) => handleSingleVerification(hash, data)} 
                                handleClick={(event: React.MouseEvent<unknown>, name: string) => handleClick(event, name)}
                                />
                            )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows_data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas por página:"
                  style={{ alignSelf: "flex-end" }}
                />
              </>
          }
        </Grid>
      </Grid>
      <BatchDialog 
        open={openDialog}
        onSelectAllClick={handleSelectAllClick}
        files={rows_data.filter((r:any) => selected.includes(r.name))}
        setVerified={(hashes:any, data:any) => handleBatchVerification(hashes, data)}
      />
    </>
  );
}

export default VerificationList;
