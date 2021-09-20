import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Grid } from "@material-ui/core";
import './Scaffold.css';

interface ScaffoldProps {
    className?: string,
    children: React.ReactNode
}

export default function Scaffold({ className, children }: ScaffoldProps){
    return (
        <>
            <div className="layout-basic-header">
                <Navbar />
            </div>
            <Grid className={`layout-basic-content ${className}`} container justify="center">
                {children}
            </Grid>
        </>
    );
}