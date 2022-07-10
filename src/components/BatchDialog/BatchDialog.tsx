import React, { useState } from "react";
import {
  Grid,
  Button
} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import Fade from '@mui/material/Fade';
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import CustomIcon from "../Icon/Icon";
import AnimationHook from "../../hooks/AnimationHook/AnimationHook";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
const { saveAs } = require("save-files");

const useStyles = makeStyles({
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
    marginRight: '10px'
  },
  verified_button: {
    background: "#00B6E6 0% 0% no-repeat padding-box", 
    border: "1px solid #00B6E6",  
    borderRadius: "13px",
    fontSize: "14px", 
    textTransform: 'none', 
    height: "24px",
    width: "133px",
    startIcon: {
      margin: 0
    },
    marginRight: '10px'
  },
  dialog: {
    borderRadius: '17px', 
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    background: "#FFFFFF",
    padding: '10px',
    height: "65px",
    zIndex: 3000,
    marginBottom: '45px'
  },
});

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

interface Data {
  name: string;
  stamp_timestamp: string | Date;
  hash: string;
}

interface DialogProps {
  open: boolean;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  files: Data[];
  setVerified: (hashes:any, data:any) => void;
}


const BatchDialog = ({ open, onSelectAllClick, files, setVerified }: DialogProps) => {
  const classes = useStyles();
  const [verification, setVerification] = useState<boolean>(false);
  const [downloadHover, setDownloadHover] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [verificationLoading, setVerificationLoading] = useState<boolean>(false);
  const rows_hashes = files.map((r:any) => r.hash)

  const handleDownload = async () => {
    setDownloadLoading(true);
    await download_file(`archivos_${get_formatted_date(new Date())}`, rows_hashes.join(','));
    setDownloadLoading(false);
  }

  const handleVerifications = async () => {
    setVerificationLoading(true);
    const res = (await Promise.all(rows_hashes.map((r:any) => verify_file(r)))).map((r:any) => r[0]);
    setVerified(rows_hashes, res);
    setVerification(true);
    setVerificationLoading(false);
  }

  return (
    <>
      {open &&
        <Fade in={open} timeout={500}>
          <Grid container item justifyContent="space-between" className={classes.dialog}>
            <Grid container xs item alignItems="center">
              <Checkbox
                checked={true}
                onChange={onSelectAllClick}
                style={{ color: "#C3C3C3" }}
              />
              <Typography style={{ color: "#000000", fontSize: "16px", height: '21px' }}>
                {`${files.length} archivo${files.length > 1 ? 's' : ''} seleccionado${files.length > 1 ? 's' : ''}`}
              </Typography>
            </Grid>
            <Grid container xs item justifyContent="flex-end" alignItems="center">
              <AnimationHook isMounted={verification === false} delay={0}>
                <Button variant='outlined' className={classes.button} onClick={() => handleVerifications()}>
                  {verificationLoading && <CircularProgress style={{ color: '#1C3B72' }} size={14} />}
                  {!verificationLoading && 'Verificar'}
                </Button>
              </AnimationHook>
              <AnimationHook isMounted={verification !== false}>
                <Button variant="outlined" className={classes.verified_button} disabled={true} onClick={(e) => e.stopPropagation()} startIcon={<CheckCircleOutlineIcon style={{ color: "#FFFFFF" }} />}>
                  <Typography className="montserrat-font" style={{ color: '#FFFFFF'}} >
                    {rows_hashes.length > 1 ? 'Verificados' : 'Verificado'}
                  </Typography>
                </Button> 
              </AnimationHook>
              <AnimationHook isMounted={true} delay={25}>
                <Button 
                  variant="outlined" 
                  className={classes.button}
                  onMouseEnter={() => setDownloadHover(true) }
                  onMouseLeave={() => setDownloadHover(false) }
                  onClick={async () => { await handleDownload() }}
                  startIcon={<CustomIcon path={`/assets/icons/${downloadHover ? 'download_white' : 'download' }.svg`} imgStyle={{ width: "70%", height: "70%", paddingTop: "3px" }} />} 
                >
                  {downloadLoading && <CircularProgress style={{ color: '#1C3B72' }} size={14} />}
                  {!downloadLoading && 'Descargar'}
                </Button>
              </AnimationHook>
            </Grid>
          </Grid>
        </Fade>
      }
    </>
  );
};

export default BatchDialog;