import { useEffect } from 'react';
import * as React from 'react';
import { Paper } from '@mui/material';
import Eventos from '../../components/Eventos.component';
import Header from '../../components/Header.component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer.component';
import Alert from '@mui/material/Alert';


export const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      url: 'http://localhost:8080/user',
      method: 'GET',
      withCredentials: true,
    })
      .then(res => {
        if (res.data.rol === "admin") {
          navigate('/empresas');
        } else {
          navigate("/home");
        }

      })
      .catch(err => {
      });
  }, []);

  return (
    <Paper>
      <Header />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
        <Alert severity="error">
          No has iniciado sesión
        </Alert>
      </div>
      <Eventos />
      <Footer />
    </Paper>
  );
};
