import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid
} from "@material-ui/core";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./HelpPage.css";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  img: {
    width: "100%",
    height: "100%",
    maxWidth: "500px",
    maxHeight: "500px"
  },
  img_icon: {
    width: "20%",
    height: "auto",
    maxWidth: "58px",
    maxHeight: "58px"
  },
  captures: {
    width: "100%",
    height: "100%",
    maxWidth: "197px",
    maxHeight: "138px"
  },
  card: {
    width: '100%', 
    borderRadius: '17px', 
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    background: "#FFFFFF",
    padding: '30px'
  },
  text_box: {
    maxWidth: "50%", 
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    marginRight: "20px"
  },
  verification_step: {
    border: "2px solid #C3C3C3",
    borderRadius: "13px",
    opacity: "1",
    maxWidth: "45%",
    margin: '9px',
    justifyContent: 'flex-start',
    alignContent: 'base-line',
    paddingLeft: '16px',
    flexWrap: 'nowrap'
  },
  p_text: { 
    fontWeight: 400, 
    color: "#707070", 
    fontSize: "15px"
  },
  number_icon: {
    maxWidth: "34px",
    maxHeight: "34px"
  }
});

const HelpPage = () => {
  const classes = useStyles();

  return (
    <Scaffold>
      <Grid item container direction='row' justifyContent="space-around">
        <Grid item xs={4} className={classes.card} container direction='column' justifyContent="flex-start" >
          <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#0D1924", fontSize: "24px", height: "36px" }} >
            ¿Cómo realizo una verificación?
          </Typography>
          <Grid item container direction='column' justifyContent="space-around"  style={{ height: '90%'}}>
            <Grid container direction='row' justifyContent="flex-start">
              <Grid item container xs className={classes.text_box}>
                <Grid item container xs style={{ marginBottom: '15px', alignItems: 'center' }}>
                  <img src={`/assets/icons/blue_1.png`} alt="" className={classes.number_icon}/>
                  <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#0D1924", fontSize: "20px", height: "36px", paddingLeft: '15px' }} >
                    Cargar
                  </Typography>
                </Grid>
                <Typography style={{ fontWeight: 400, color: "#707070", fontSize: "16px", height: "36px", paddingLeft: '15px' }} >
                  En la página inicial clickear en “Archivos a estampar” y seleccionar el documento que se deseado.
                </Typography>
              </Grid>
              <Grid item xs style={{ justifySelf: 'flex-end', height: '100%' }}>
                <img src={`/assets/images/Cargar.png`} alt="" className={classes.captures}/>
              </Grid>
            </Grid>
            <Grid container direction='row' justifyContent="flex-start">
              <Grid item container className={classes.text_box}>
                <Grid item container xs style={{ marginBottom: '15px', alignItems: 'center' }}>
                  <img src={`/assets/icons/blue_2.png`} alt="" className={classes.number_icon}/>
                  <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#0D1924", fontSize: "20px", height: "36px", paddingLeft: '15px' }} >
                    Estampar
                  </Typography>
                </Grid>
                <Typography style={{ fontWeight: 400, color: "#707070", fontSize: "16px", height: "36px", paddingLeft: '15px' }} >
                  Una vez cargado el archivo, el mismo aparecerá en espera para ser estampado.
                </Typography>
              </Grid >
              <Grid item xs style={{ justifySelf: 'flex-end', height: '100%' }}>
                <img src={`/assets/images/Estampar.png`} alt="" className={classes.captures} />
              </Grid>
            </Grid>
            <Grid container direction='row' justifyContent="flex-start">
              <Grid item container className={classes.text_box}>
                <Grid item container xs style={{ marginBottom: '15px', alignItems: 'center' }}>
                  <img src={`/assets/icons/blue_3.png`} alt="" className={classes.number_icon}/>
                  <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#0D1924", fontSize: "20px", height: "36px", paddingLeft: '15px' }} >
                    Verificar
                  </Typography>
                </Grid>
                <Typography style={{ fontWeight: 400, color: "#707070", fontSize: "16px", height: "36px", paddingLeft: '15px' }} >
                  Los archivos estampados se visualizan en la tabla inferior, se hará click en “Verificar” para comprobar cada archivo.
                </Typography>
              </Grid>
              <Grid item xs style={{ justifySelf: 'flex-end', height: '100%' }}>
                <img src={`/assets/images/Verificar.png`} alt="" className={classes.captures}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7} className={classes.card} container direction='row' justifyContent="center">
          <Grid item xs container direction='column'>
            <Grid item xs container direction='column'>
              <Typography className="montserrat-font" style={{ fontWeight: 600, color: "#0D1924", fontSize: "24px", height: "36px" }} >
                ¿Cómo funciona?
              </Typography>
              <Typography className={classes.p_text}>
                Los pasos ejecutados por el sistemas son:
              </Typography>
            </Grid>
            <Grid item container direction="column" alignContent="center">
              <Grid item xs container direction='column' alignContent="center">
                <img src={`/assets/images/como_funciona.png`} alt="" className={classes.img} />
              </Grid>
              <Grid item container direction='column' alignContent="center">
                <Grid item container justifyContent="center">
                  <Grid item xs container direction='row' justifyContent="flex-start" alignItems="center" className={classes.verification_step}>
                      <img src={`/assets/icons/gray_1.png`} alt="" className={classes.number_icon}/>
                      <img src={`/assets/icons/file_icon.png`} alt="" className={classes.img_icon}/>
                      <Typography className={classes.p_text}>
                        Se envia el archivo a estampar.
                      </Typography>
                  </Grid>
                  <Grid item xs container direction='row' justifyContent="flex-start" alignItems="center" className={classes.verification_step}>
                      <img src={`/assets/icons/gray_2.png`} alt="" className={classes.number_icon}/>
                      <img src={`/assets/icons/hash_icon.png`} alt="" className={classes.img_icon}/>
                      <Typography className={classes.p_text}>
                        Se recibe el número de bloque.
                      </Typography>
                  </Grid>
                </Grid>
                <Grid item container justifyContent="center">
                  <Grid item xs container direction='row' justifyContent="flex-start" alignItems="center" className={classes.verification_step}>
                      <img src={`/assets/icons/gray_3.png`} alt="" className={classes.number_icon}/>
                      <img src={`/assets/icons/button_icon.png`} alt="" className={classes.img_icon}/>
                      <Typography className={classes.p_text}>
                        Se verifica el archivo.
                      </Typography>
                  </Grid>
                  <Grid item xs container direction='row' justifyContent="flex-start" alignItems="center" className={classes.verification_step}>
                      <img src={`/assets/icons/gray_4.png`} alt="" className={classes.number_icon}/>
                      <img src={`/assets/icons/check_icon.png`} alt="" className={classes.img_icon}/>
                      <Typography className={classes.p_text}>
                        Se confirma la integridad del archivo.
                      </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Scaffold>
  );
}

export default HelpPage;