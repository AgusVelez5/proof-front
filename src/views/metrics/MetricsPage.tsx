import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Button,
  ButtonGroup
} from "@material-ui/core";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./MetricsPage.css";
import { useHistory } from "react-router-dom";

function MetricsPage() {
  const history = useHistory()


  return (
    <Scaffold className="p-left-2 p-right-2">
      <Grid item xs={12} className="p-2" container justifyContent="center">
        <Grid item xs={8} className="p-2" container direction='column' >
          <Grid item className="p-2" container direction='column' >
            <ButtonGroup variant="text" aria-label="text button group">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Grid>
          <Grid item className="p-2" container direction='column' >
            <ButtonGroup variant="text" aria-label="text button group">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </Scaffold>
  );
}

export default MetricsPage;