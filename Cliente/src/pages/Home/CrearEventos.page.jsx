import { useEffect } from 'react';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header.component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { useState } from 'react';

const theme = createTheme();

export const CrearEvento = () => {
  const navigate = useNavigate();
  const [idEmpresa, setIdEmpresa] = useState('');
  const [error, setError] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombre, setNombre] = useState("");
  const [aforo, setAforo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [artista, setArtista] = useState("");
  const [precio, setPrecio] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [alerta, setAlerta] = useState("");


  useEffect(() => {
    axios({
      url: 'http://localhost:8080/user',
      method: 'GET',
      withCredentials: true,
    })
      .then(res => {
        if (res.data.rol == "usuario") {
          navigate('/');
        }
        document.title = `Crear Evento`;
        setIdEmpresa(res.data.id);
        if (res.data.rol == "empresa") {
          if (res.data.isVerified == false) {
            setError("La empresa aún no ha sido verificada!!!")
          }
        }
      })
      .catch(err => {
        navigate('/');
      });

    let timeout;

    if (alerta) {
      timeout = setTimeout(() => {
        setAlerta("");
      }, 5000); // 10 segundos
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [idEmpresa, alerta]);

  const handleSubmit = () => {

    if (nombre === "" || descripcion === "" || ubicacion === "" || fecha === "" || aforo === "" || precio === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    const evento = {
      id_empresa: idEmpresa,
      nombre_evento: nombre,
      artista,
      ubicacion,
      aforo: aforo,
      descripcion,
      fecha_evento: fecha,
      precio: precio,
    };


    axios.post("http://localhost:8080/eventos/crear", evento)
      .then((response) => {
        setAlerta("Evento creado exitosamente")
      })
      .catch((error) => {
        setError("Error la empresa no está verificada");
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "nombre":
        setNombre(value);
        break;
      case "descripcion":
        setDescripcion(value);
        break;
      case "ubicacion":
        setUbicacion(value);
        break;
      case "fecha":
        setFecha(value);
        break;
      case "aforo":
        setAforo(value);
        break;
      case "precio":
        setPrecio(value);
        break;
      case "artista":
        setArtista(value);
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container component="main" maxWidth="sm">
        {alerta && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
            <Alert severity="success">
              {alerta}
            </Alert>
          </div>
        )}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', mt: 3
          }}
        >
          <Typography component="h1" variant="h3" marginBottom={8}>
            Crear Evento
          </Typography>
          {error && (
            <Typography variant="body2" color="error" align="center" marginBottom={4}>
              {error}
            </Typography>
          )}
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  autoFocus
                  onChange={handleChange}
                  value={nombre}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="artista"
                  label="Artistas"
                  type="text"
                  id="artista"
                  onChange={handleChange}
                  value={artista}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="text"
                  id="descripcion"
                  label="Descripcion"
                  name="descripcion"
                  onChange={handleChange}
                  value={descripcion}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="ubicacion"
                  label="Ubicacion"
                  type="text"
                  id="ubicacion"
                  onChange={handleChange}
                  value={ubicacion}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="fecha"
                  label="Fecha del Evento"
                  type="date"
                  id="fecha"
                  onChange={handleChange}
                  value={fecha}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: today, // Establece la fecha mínima como hoy
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="aforo"
                  label="Aforo"
                  type="number"
                  id="aforo"
                  onChange={handleChange}
                  value={aforo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="precio"
                  label="Precio"
                  type="number"
                  id="precio"
                  onChange={handleChange}
                  value={precio}
                />
              </Grid>
            </Grid>
          </div>
          <Button
            onClick={handleSubmit}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Crear Evento</Button>
        </Box>
      </Container>
    </ThemeProvider >
  );
};