import React from "react";
import {
  Grid,
  TextField, 
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./AdvancePage.css";
import { useSnackbar } from "notistack";
import { Card, CardContent } from '@mui/material';
import CustomIcon from "../../components/Icon/Icon";
import Typography from '@material-ui/core/Typography';
import Fade from '@mui/material/Fade';

const useStyles = makeStyles({
  card: {
    width: '100%', 
    borderRadius: '17px', 
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
  },
  copy_button: {
    background: "#00B6E6 0% 0% no-repeat padding-box", 
    border: "0px",
    borderRadius: "13px",
    fontSize: "14px", 
    textTransform: 'none', 
    height: "24px",
    width: "133px",
    color: '#FFFFFF',
    "&:hover": {
      background: "#00B6E6 0% 0% no-repeat padding-box", 
    },
    marginTop: "5px",
    alignSelf: 'flex-end'
  }
});

const card = {
  width: '100%', 
  borderRadius: '17px', 
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
}

const iframe_data = [
  {
    name: "Estampado",
    attr: ``,
    path: "iframe_stamp"
  },
  {
    name: "Estampados pendientes",
    attr: `width="550px" height="362px" style="border: none;"`,
    path: "iframe_pending_stamp"
  },
  {
    name: "Verificación",
    attr: `width="50%" height="474px" style="border: none;"`,
    path: "iframe_verify"
  },
  {
    name: "Métricas por tiempo",
    attr: `width="50%" height="570px" style="border: none;"`,
    path: "iframe_metrics_time"
  },
  {
    name: "Métricas por archivo",
    attr: `width="50%" height="570px" style="border: none;"`,
    path: "iframe_metrics_file"
  },
]

const AdvancePage = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const onCopy = (text:string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(
      'Texto copiado al portapapeles',
      {
        variant: "success",
        persist: false,
        TransitionComponent: Fade,
        // @ts-ignore
        sx: {
          "& .SnackbarContent-root": { background: "#FFFFFF", borderColor: "#1C3B72", borderWidth: "55px", color: "#1C3B72" }
        }
      }
    )
  } 

  return (
    <Scaffold>
      <Grid item className="p-2" container justifyContent="center">
        <Grid item xs={6} direction='column' alignItems="center" container>
          <Grid item className="p-2 m-bottom-4" container justifyContent="center">
            <Typography style={{ color: "#707070", fontSize: "16px", height: "22px" }}>
              Podés utilizar estos componentes de forma aislada en tu propia aplicación utilizando los siguientes fragmentos de código.
            </Typography>
          </Grid>
          {iframe_data.map((d:any) => (
            <Grid item xs className="m-top-2" container justifyContent="center">
              <Card variant="outlined" style={card}>
                <CardContent>
                  <Grid item container direction="row" justifyContent="space-around" alignItems="center" >
                    <TextField label={`Iframe ${d.name}`} defaultValue={`<iframe src="${window.location.origin}/${d.path}" ${d.attr}></iframe>`} variant="standard" style={{ width: "70%"}}/>
                    <Button 
                      variant="outlined" 
                      className={classes.copy_button} 
                      startIcon={<CustomIcon path={`/assets/icons/copy_white.svg`} />}
                      onClick={() => onCopy(`<iframe src="${window.location.origin}/${d.path}" ${d.attr}></iframe>`)}
                    >
                      <Typography className="montserrat-font" style={{ color: '#FFFFFF'}} >
                        Copiar
                      </Typography>
                    </Button> 
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Scaffold>
  );
}

export default AdvancePage;