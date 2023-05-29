import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Header from '../../components/Header.component';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InfoIcon from '@mui/icons-material/Info';
import {useNavigate} from 'react-router-dom';

export const Entradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    axios({
      url: 'http://localhost:8080/user',
      method: 'GET',
      withCredentials: true,
    })
      .then(res => {   
        document.title = `Mis Entradas`;    
      })
      .catch(err => {
        navigate('/');
      });

    axios.get('http://localhost:8080/entradas', { withCredentials: true })
      .then(response => {
        setEntradas(response.data); // Asignar el array de entradas

      })
      .catch(error => {
        console.log('Error:', error);
      });
  }, []);

  const handleDetallesClick = async (idEvento) => {
    try {
      const response = await axios.post('http://localhost:8080/eventos', { id: idEvento });
      const evento = response.data;
      setEventoSeleccionado(evento);
      setOpenDialog(true);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  

  return (
    <>
      <CssBaseline />
      <main>
        <Header />

        <Container sx={{ py: 8 }} maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Mis Entradas
          </Typography>
          <Grid container spacing={4}>
            {entradas.map(entrada => (
              <Grid item key={entrada.codigo} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '20px'
                    }}>
                    <QRCode value={entrada.codigo} />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Núm. de Entradas: {entrada.num_entradas}
                    </Typography>
                    <Typography>
                      Código de la Entrada: {entrada.codigo}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" startIcon={<InfoIcon />} onClick={() => handleDetallesClick(entrada.id_evento)}>Detalles</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {eventoSeleccionado && (
          <div>
            <DialogTitle>{eventoSeleccionado.nombre_evento}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">Artistas: {eventoSeleccionado.artista}</Typography>
              <Typography variant="body2">Ubicación: {eventoSeleccionado.ubicacion}</Typography>
              <Typography variant="body2">Aforo: {eventoSeleccionado.aforo}</Typography>
              <Typography variant="body2">Descripción: {eventoSeleccionado.descripcion}</Typography>
              <Typography variant="body2">Fecha: {eventoSeleccionado.fecha_evento}</Typography>
              <Typography variant="body2">Precio: {eventoSeleccionado.precio}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
            </DialogActions>
          </div>
        )}
      </Dialog>
    </>
  );
}
