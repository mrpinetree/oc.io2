import {CssBaseline, Paper} from '@mui/material';
import {Header} from './Header.component';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from '../pages/Landing/Landing.page';
import { HomePage } from '../pages/Home/Home.page';
import { createTheme, ThemeProvider } from "@mui/material/styles"; // ! Importadlo de @mui/material/styles
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { orange } from '@mui/material/colors';
import SignIn from '../pages/Login/Login.page';
import Registro from '../pages/Register/Register.page';
import { Entradas } from '../pages/Home/Entradas.page';
import { CrearEvento } from '../pages/Home/CrearEventos.page';
import { Empresas } from '../pages/Empresas/Empresas.page';
import { ValidarEmpresas } from '../pages/Empresas/ValidarEmpresas.page';
import { Perfil } from '../pages/Home/MiPerfil.page';


const App = () => {
    // Preferencia por el modo oscuro

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)'); // Leer el modo del sistema

// Tema personalizado con colores vibrantes
const theme = React.useMemo(() => createTheme({
  palette: {
    mode: !!prefersDarkMode ? 'dark' : 'light',
    primary: {
      main: '#FF9800', // Naranja brillante
    },
    secondary: {
      main: '#C62828', // Rojo
    },
    background: {
        default: '#F5F5F5', // Gris claro
      },
    error: {
      main: '#C62828', // Naranja oscuro
    },
    warning: {
      main: '#FFC107', // Amarillo
    },
    info: {
      main: '#2196F3', // Azul
    },
    success: {
      main: '#4CAF50', // Verde
    },
  },
}));
        
    return (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
            <Routes>
                <Route exact path="/" element={<LandingPage />} />  
                <Route path='/home' element={<HomePage />} />   
                <Route exact path="/login" element={<SignIn />} />
                <Route exact path="/registro" element={<Registro />} />  
                <Route exact path="/home/entradas" element={<Entradas/>} />
                <Route exact path="/home/crearEvento" element={<CrearEvento/>}  />
                <Route exact path="/home/perfil" element={<Perfil/>}  />
                <Route path="/empresas" element={<Empresas/>}  />
                <Route path="/validarEmpresas" element={<ValidarEmpresas/>}  />
            </Routes>
        </Router>
    </ThemeProvider>
    );
}
export default App;