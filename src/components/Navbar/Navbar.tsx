import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import "./NavBar.css";
import {
  Grid,
  Toolbar,
  AppBar,
  Button
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  tabs: {
    marginRight: theme.spacing(2),
  },
  homeImg: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "white",
    color: "black"
},
}));

const Navbar = () => {

  const classes = useStyles()

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar>
        <Grid container xs={12} justifyContent="center">
          <Grid item xs={8} container alignContent="center" alignItems="center">
            <Grid item xs={3}>
              <Button href="/" >
                <img
                    alt="Verificador"
                    className="menu-logo"
                    src={process.env.PUBLIC_URL + "/assets/logos/UccIcon.png"}
                />
              </Button>
            </Grid>
            <Grid item xs container justify="flex-end">
              <Button  href="/" color="inherit" className={classes.tabs}>Home</Button>
              <Button  href="/metrics" color="inherit" className={classes.tabs}>Métricas</Button>
              <Button  href="/advance" color="inherit" className={classes.tabs}>Avanzado</Button>
              <Button  href="/help" color="inherit" className={classes.tabs}>Ayuda</Button>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;