import React, { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiTableCell from "@material-ui/core/TableCell";
import TablePagination from '@mui/material/TablePagination';
import { Grid } from "@material-ui/core";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Typography from '@material-ui/core/Typography';

const TableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell);

const useStyles = makeStyles({
  tableHead: {
    borderBottom: '5px solid #1C3B72'
  } 
});

const get_formatted_date = (base_date:Date) => `${base_date.getDate() < 10 ? '0' : ''}${base_date.getDate()}/${(base_date.getMonth() + 1) < 10 ? '0' : ''}${base_date.getMonth() + 1}/${base_date.getFullYear()}`;

const Row = ({ row }:any) => {
  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          <Typography style={{ color: "#272727", fontSize: "15px" }} >
            {row.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography style={{ color: "#272727", fontSize: "15px" }} >
            {row.stamp_timestamp ? get_formatted_date(new Date(row.stamp_timestamp)) : '   --/--/--'}
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
}

interface PendingListProps {
  rows_data: any;
  iframe: boolean;
} 

const PendingList = ({ rows_data, iframe }: PendingListProps) => {
  const rowsPerPage = 5;
  const classes = useStyles();
  const [page, setPage] = useState(0);

  rows_data = rows_data.filter((f:any) => f.stamped !== true)

  const Paging = () => {
    return (
      <div>
        <IconButton 
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          style={{ paddingBottom: "0px", paddingTop: "4px" }}
        >
          <ArrowBackIosIcon style={{ width: '20px', height: '18px'}} />
        </IconButton>
        <IconButton 
          disabled={ (rows_data.length - ((page + 1) * rowsPerPage)) < 0 }
          onClick={() => setPage(page + 1)}
          style={{ paddingBottom: "0px", paddingTop: "4px" }}
        >
          <ArrowForwardIosIcon style={{ width: '20px', height: '18px'}} />
        </IconButton>
      </div>
    )
  }

  return (
      <Grid container direction="column" style={iframe ? { width: '100%', height: '100%' } : { flex: '1 1 auto' }}>
        <TableContainer component={Paper} style={{borderRadius: '17px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', flex: '1 1 auto' }}>
          <Table style={{ flexGrow: 1, flex: '1 1 auto', ...(rows_data.length === 0 ? { height: '340px' } : {})}}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>
                  <Typography className="montserrat-font" style={{ color: "#1C3B72", fontSize: "20px", fontWeight: 700, textTransform: "uppercase" }} >
                    Nombre
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className="montserrat-font" style={{ color: "#1C3B72", fontSize: "20px", fontWeight: 700, textTransform: "uppercase" }} >
                    Fecha
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows_data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => (
                <Row key={row.hash} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="space-between" style={{ paddingTop: '5px', padding: '0px 15px 0px 15px', justifySelf: 'flex-end'}}>
          <Typography style={{ color: "#707070", fontSize: "16px", height: "22px" }} >
            Aquí se listan los archivos en proceso de estampado.
          </Typography>
          <Paging />
        </Grid>
      </Grid>
  );
}

export default PendingList;