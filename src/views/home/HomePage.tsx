import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import DropzoneArea from '../../components/DropzoneArea/DropzoneArea';
import Scaffold from "../../components/Scaffold/Scaffold";
import PendingList from "../../components/PendingList/PendingList";
import VerificationList from "../../components/VerificationList/VerificationList";
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import "./HomePage.css";
import { Card, CardContent } from '@mui/material';
import Typography from '@material-ui/core/Typography';
import TableSkeleton from "../../components/Skeletons/TableSkeleton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const useStyles = makeStyles({
  card: {
    width: '100%', 
    borderRadius: '17px', 
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
  }
});

const fetch_by_path = async (path:string, params: any = {}) => (await axios.get(`${BACK_URL}/api/${path}`, { params })).data.data

const HomePage = () => {
  const classes = useStyles();
  const [newFiles, setNewFiles] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => await fetch_by_path('file_data').then(r => {
      setFiles(r)
      setLoading(false);
    }))();
  }, []);

  useEffect(() => {
    setFiles([...files, ...newFiles])
  }, [newFiles]);

  const handleStamp = (file_names:any) => setNewFiles(file_names.map((f:string) => ({ name: f })))

  return (
    <Scaffold>
      <Grid item container direction="column" alignItems="center" alignContent="center">
        <Grid item xs container alignItems="center" alignContent="center">
          <Grid item xs container direction="column" className="p-right-3" style={{ height: "100%" }} >
            <Grid container item>
              <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#9A9A9A", fontSize: "20px", height: "36px", paddingLeft: '15px' }} >
                Archivos por verificar
              </Typography>
              <Tooltip title="Archivos que se estamparan y luego podran ser verificados" placement="right" arrow TransitionComponent={Fade}>
                <InfoOutlinedIcon style={{ width: '15px', height: 'auto', color: '#1C3B72', alignSelf: 'flex-start', marginLeft: '5px', marginTop: '2px'}}/>
              </Tooltip>
            </Grid>
            <Card className={classes.card} style={{ flexGrow: 1, height: '344px' }}>
              <CardContent style={{ flexGrow: 1, height: "90%" }}>
                  <DropzoneArea
                    onChange={(files:any) => console.log('Files:', files)}
                    onStamp={(f:any) => handleStamp(f)}
                  />
              </CardContent>
            </Card>
            <Grid container style={{ paddingTop: '5px', paddingLeft: '15px'}}>
              <Typography style={{ color: "#707070", fontSize: "16px", height: "22px" }} >
                Una vez sueltos los archivos, se colocaran en la lista de espera.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs container direction="column" style={{ height: '100%' }}>
            <Grid container item>
              <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#9A9A9A", fontSize: "20px", height: "36px", paddingLeft: '15px' }} >
                En espera
              </Typography>
              <Tooltip title="Archivos en proceso de estampado" placement="right" arrow TransitionComponent={Fade}>
                <InfoOutlinedIcon style={{ width: '15px', height: 'auto', color: '#1C3B72', alignSelf: 'flex-start', marginLeft: '5px', marginTop: '2px'}}/>
              </Tooltip>
            </Grid>
            {loading ?
              <Card className={classes.card}>
                <CardContent>
                  <Grid container justifyContent="center" alignItems="center">
                    <TableSkeleton style={{ width: '100%', height: 'auto' }} />
                  </Grid>
                </CardContent>
              </Card>
            : 
              <PendingList rows_data={files} iframe={false}/>
            }
          </Grid>
        </Grid>
        <Grid item xs container alignItems="center" alignContent="center" style={{ paddingTop: '75px' }}>
          <Grid container item>
            <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#9A9A9A", fontSize: "20px", height: "36px", marginLeft: '15px' }} >
              Archivos estampados
            </Typography>
            <Tooltip title="Archivos estampados, se pueden verificar y descargar" placement="right" arrow TransitionComponent={Fade}>
              <InfoOutlinedIcon style={{ width: '15px', height: 'auto', color: '#1C3B72', alignSelf: 'flex-start', marginLeft: '5px', marginTop: '2px'}}/>
            </Tooltip>
          </Grid>
          <VerificationList files={files} rows_data={files} loading={loading} iframe={false}/>
        </Grid>
      </Grid>
    </Scaffold>
  );
}

export default HomePage;