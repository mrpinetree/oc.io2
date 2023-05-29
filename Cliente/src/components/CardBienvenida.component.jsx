import React from 'react';
import { Typography, createTheme } from '@mui/material';
import fondo from "../img/fondo.jpg";

const theme = createTheme({
  typography: {
    poster: {
      fontSize: '4rem',
      color: 'red',
    },
    // Disable h3 variant
    h3: undefined,
  },
});

const Card = ({ username }) => {
  return (
    <div style={{
      background: `url(${fondo}) center/cover`,
      width: '100%',
      maxWidth: '1000px',
      height: '200px',
      borderRadius: '10px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '4rem',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
    }}>
      <Typography variant="h3" sx={{color: 'rgba(255, 255, 255, 0.9)', mb: 2 }} fontFamily={'serif'}>
        ¡Bienvenido, {username}!
      </Typography>
      <Typography variant="h4" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }} fontFamily={'serif'}>
        Espero que disfrutes de la aplicación
      </Typography>
    </div>
  );
};

export default Card;




