import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <SnackbarProvider maxSnack={5}>
    <App />
  </SnackbarProvider>, 
  document.getElementById('root'));
