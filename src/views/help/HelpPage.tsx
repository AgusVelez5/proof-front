import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Accordion
} from "@material-ui/core";
import Scaffold from "../../components/Scaffold/Scaffold";
import "./HelpPage.css";

function HelpPage() {


  return (
    <Scaffold className="p-left-2 p-right-2">
      <Grid item xs={12} className="p-2" container justifyContent="center">
        <Grid item xs={6} className="p-2" container direction='column'>
          <div>
            <h2>Objetivo</h2>
            <p>
              El objetivo de esta aplicación es proporcionar una herramienta la cual permita a las instituciones, en este caso a la UCC, brindar un mayor nivel de transparencia en sus procesos. 
              Esto se logra a partir del uso de este sistema verificador de integridad, el cual permite estampar archivos en la blockchain de bitcoin, es decir, guardarlos de tal forma que en un futuro podamos discernir si el archivo que poseemos fue modificado o no respecto al original, osea el guardado en la blockchain.
            </p>
          </div>
          <div>
            <h2>¿Cómo funciona?</h2>
            <p>
              Los pasos ejecutados por el sistemas son:
            </p>
            <p>
              Recolección de archivos a estampar.
              Estos archivos son enviados a la blockchain.
              Se recibe como respuesta el número de bloque donde fue guardado el archivo.
              Finalmente uno puede verificar la cantidad de veces deseadas el archivo que se posee contra el de la blockchain.
            </p>
          </div>
          <div>
            <h2>¿Cómo realizo una verificación?</h2>
            <p>
              En la página principal hacer click en “Archivos a estampar” y seleccionar el documento que se desea usar.

              Imágenes

              En segundo lugar, veremos que nuestro archivo está en la lista de espera.

              Imágen

              Finalmente, veremos el archivo ya estampado, para verificarlo simplemente hacemos click en “verificar”.

              Imágen
            </p>
          </div>
        </Grid>
      </Grid>
    </Scaffold>
  );
}

export default HelpPage;