import React from "react";
import Navbar from '../Navbar/Navbar';
import { Grid } from "@material-ui/core";
import './Scaffold.css';

interface ScaffoldProps {
  children: React.ReactNode
}

const Scaffold = ({ children }: ScaffoldProps) => {

  return (
    <>
      <Grid container item xs={12} justifyContent="center">
        <Grid container className="layout-basic-header" justifyContent="center">
          <Navbar />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="center" style={{ marginBottom: '25px'}}>
        <Grid container item xs={12} lg={10} xl={8} className="layout-basic-content" justifyContent="center">
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default Scaffold;