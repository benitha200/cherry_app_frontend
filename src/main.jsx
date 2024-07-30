import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react";
import { PrimeReactProvider } from 'primereact/api';

// PrimeReact and PrimeFlex styles
import 'primereact/resources/themes/lara-light-blue/theme.css';  // theme
import 'primereact/resources/primereact.min.css';                  // core css
import 'primeicons/primeicons.css';                                // icons
import 'primeflex/primeflex.css';                                  // primeflex

// Your custom styles
import './index.css';
import './flags.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PrimeReactProvider>
  </React.StrictMode>
)