import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  typography : {
    useNextVariants: true,
    fontFamily: "Noto Sans KR"
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
