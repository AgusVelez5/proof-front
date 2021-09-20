import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  TextField
} from "@material-ui/core";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./AdvancePage.css";
import { useHistory } from "react-router-dom";

function AdvancePage() {
  const history = useHistory()


  return (
    <Scaffold className="p-left-2 p-right-2">
      <Grid item xs={12} className="p-2" container justifyContent="center">
        <Grid item xs={4} className="p-4" direction='column' alignItems="center" container>
          <Grid item  className="p-2 m-bottom-4" container>
            <div>
              Podeés utilizar estos componentes de forma aislada en tu propia aplicación utilizando los siguientes iframes:
            </div>
          </Grid>
          
          <div className="m-2">
            <TextField label="Iframe Estampado" defaultValue="Hello World" variant="standard" />
          </div>
          <div className="m-2">
            <TextField label="Iframe Verificación" defaultValue="Hello World" variant="standard" />
          </div>
          <div className="m-2">
            <TextField  label="Iframe Métricas" defaultValue="Hello World" variant="standard" />
          </div>
        </Grid>
      </Grid>
    </Scaffold>
  );
}

export default AdvancePage;