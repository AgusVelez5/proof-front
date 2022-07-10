import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import "./NavBar.css";
import {
  Grid,
  Toolbar,
  AppBar,
  Button
} from "@material-ui/core";
import CustomIcon from "../Icon/Icon";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  tabs: {
    marginRight: theme.spacing(2),
    color: "#848484",
    '&:hover': {
      color: '#1C3B72',
    }, 
    "&:hover $icon": {
      color: 'red',
    },
    textTransform: 'none'
  },
  homeImg: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "white",
    color: "black",
    "padding-left": "2%",
    "padding-right": "2%",
    "border-bottom":  "solid #1C3B72 6px"
  },
}));

// TODO make funtions to take the needed color
const icon_paths = {
  home: (variant = '') => `/assets/icons/Home_icon${variant ? `_${variant}` : variant }.svg`,
  metrics: (variant = '') => `/assets/icons/Metrics_icon${variant ? `_${variant}` : variant }.svg`,
  advance: (variant = '') => `/assets/icons/Advance_icon${variant ? `_${variant}` : variant }.svg`,
  help: (variant = '') => `/assets/icons/Help_icon${variant ? `_${variant}` : variant }.svg`
}

const Navbar = () => {
  const classes = useStyles();
  const location = window.location.pathname;
  const [homeHover, setHomeHover] = useState<boolean>(false);
  const [metricsHover, setMetricsHover] = useState<boolean>(false);
  const [advanceHover, setAdvanceHover] = useState<boolean>(false);
  const [helpHover, setHelpHover] = useState<boolean>(false);
  
  return (
    <AppBar elevation={0} position="static" className={classes.appbar}>
      <Toolbar style={{ display: "flex", justifyContent: "center" }}>
        <Grid container xs={12} lg={10} xl={8} item justifyContent="center">
          <Grid item container alignContent="center" alignItems="center">
            <Grid item xs={3}>
              <Button href="/" >
                <img
                    alt="Verificador"
                    className="menu-logo"
                    src={`/assets/logos/UccIcon.png`}
                />
              </Button>
            </Grid>
            <Grid item xs container justifyContent="flex-end">
              <Button 
                href="/" 
                className={classes.tabs} 
                startIcon={<CustomIcon path={ location === '/' ? icon_paths.home('here') : homeHover ? icon_paths.home('hover') : icon_paths.home() } />}
                onMouseEnter={() => setHomeHover(true) }
                onMouseLeave={() => setHomeHover(false) }
                style={ location === '/' ? { color:'#343C43'} : {} }
                >
                <Typography className="montserrat-font" style={{ color: "inherit", fontSize: "20px", fontWeight: 600 }} >
                  Home
                </Typography>
              </Button>
              <Button 
                href="/metrics" 
                className={classes.tabs} 
                startIcon={<CustomIcon path={ location === '/metrics' ? icon_paths.metrics('here') : metricsHover ? icon_paths.metrics('hover') : icon_paths.metrics() } />}
                onMouseEnter={() => setMetricsHover(true) }
                onMouseLeave={() => setMetricsHover(false) }
                style={ location === '/metrics' ? { color:'#343C43'} : {} }
                >
                <Typography className="montserrat-font" style={{ color: "inherit", fontSize: "20px", fontWeight: 600 }} >
                  Métricas
                </Typography>
              </Button>
              <Button 
                href="/advance" 
                className={classes.tabs} 
                startIcon={<CustomIcon path={ location === '/advance' ? icon_paths.advance('here') : advanceHover ? icon_paths.advance('hover') : icon_paths.advance() } />}
                onMouseEnter={() => setAdvanceHover(true) }
                onMouseLeave={() => setAdvanceHover(false) }
                style={ location === '/advance' ? { color:'#343C43'} : {} }
                >
                <Typography className="montserrat-font" style={{ color: "inherit", fontSize: "20px", fontWeight: 600 }} >
                  Avanzado
                </Typography>
              </Button>
              <Button 
                href="/help"
                className={classes.tabs} 
                startIcon={<CustomIcon path={ location === '/help' ? icon_paths.help('here') : helpHover ? icon_paths.help('hover') : icon_paths.help() } />}
                onMouseEnter={() => setHelpHover(true) }
                onMouseLeave={() => setHelpHover(false) }
                style={ location === '/help' ? { color:'#343C43'} : {} }
                >
                <Typography className="montserrat-font" style={{ color: "inherit", fontSize: "20px", fontWeight: 600 }} >
                  Ayuda
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;