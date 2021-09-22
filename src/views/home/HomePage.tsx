import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Link,
} from "@material-ui/core";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./HomePage.css";

function HomePage() {


  return (
    <Scaffold className="p-left-2 p-right-2">
      <Grid item xs={12} className="p-2" container justify="space-between" alignItems="center" alignContent="center">
        <Grid item xs={12} className="p-2" container justify="space-between" alignItems="center" alignContent="center">
          <Grid item xs={12} className="p-2">
          
          </Grid>
          <Grid item xs={12} className="p-2" >
          
          </Grid>

        </Grid>
        <Grid item xs={12} className="p-2" container justify="space-between" alignItems="center" alignContent="center">
          <Grid item xs={12} className="p-2" >
          
          </Grid>
        </Grid>        
      </Grid>
    </Scaffold>
  );
}

export default HomePage;