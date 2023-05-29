import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import backgroundImage from '../../img/bienvenido.jpg';
import logoImageUrl from '../../img/logo.PNG'
import Alert from '@mui/material/Alert';
const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    let timeout;

    if (alerta) {
      timeout = setTimeout(() => {
        setAlerta("");
      }, 5000); // 10 segundos
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [alerta],);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!!username && !!password) {
      axios({
        url: 'http://localhost:8080/login',
        method: 'POST',
        withCredentials: true,
        data: {
          email: username,
          password: password,
        }
      }).then(response => {
        if ((!!response.data) && (response.data.rol !== "admin")) {
          navigate('/home');
        } else {
          navigate('/empresas');
        }
      }).catch(error => {
        if (error.response && error.response.status === 401) {
          setAlerta("Credenciales incorrectas");
        } else {
          setAlerta("Hubo un error en el servidor");
        }
      });
    } else {
      setAlerta("Por favor, completa todos los campos");
      return;
    }


  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          component="div" // Agrega esta línea para especificar el elemento div dentro del Grid
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ mb: 4, mt: 20 }}>
              <img src={logoImageUrl} alt="Logo" style={{ width: 150, height: 64, borderRadius: '70%' }} />
            </Box>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {alerta && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                  <Alert severity="error">
                    {alerta}
                  </Alert>
                </div>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={e => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contrasena"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
              />

              <Button
                onClick={handleSubmit}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/home" variant="body2">
                    Volver
                  </Link>
                </Grid>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/registro" variant="body2">
                    {"¿No tienes cuenta? Regístrate"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }} fontFamily={'serif'}>
            {'Copyright © OC.IO '}
          </Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}