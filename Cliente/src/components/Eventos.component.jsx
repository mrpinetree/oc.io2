import { useState, useEffect } from 'react';
import * as React from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SaveIcon from '@mui/icons-material/Save';



export const Eventos = () => {

  const columnsEmp = [
    { name: 'nombre_evento', label: 'Evento' },
    { name: 'artista', label: 'Artista/s' },
    { name: 'ubicacion', label: 'Lugar' },
    { name: 'aforo', label: 'Aforo Restante' },
    { name: 'descripcion', label: 'Descripcion' },
    {
      name: 'fecha_evento', label: 'Fecha',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString('es-ES')
      }
    },
    { name: 'precio', label: 'Precio' },
    { name: 'id_evento', label: 'id', options: { display: 'excluded' } },
    {
      name: 'Acciones',
      label: '',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(tableMeta.rowData[7])} style={{ marginRight: '10px' }}></Button>
            <Button variant="contained" color="success" startIcon={<UpdateIcon />} onClick={() => handleModificarClick(tableMeta.rowData[7], tableMeta.rowData)}></Button>
          </>

        ),
      },
    },

  ];

  const columnsE = [
    { name: 'nombre_evento', label: 'Evento' },
    { name: 'artista', label: 'Artista/s' },
    { name: 'ubicacion', label: 'Lugar' },
    {
      name: 'fecha_evento',
      label: 'Fecha',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString('es-ES')
      }
    },
    {
      name: 'precio', label: 'Precio',
      options: {
        customBodyRender: (value) => (
          <>
            {value} <EuroSymbolIcon />
          </>
        )
      }
    },
    { name: 'id_evento', label: 'id', options: { display: 'excluded' } },
    {
      name: 'Acción',
      label: '',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <Button variant="contained" color="primary" startIcon={<AddShoppingCartIcon />} onClick={() => handleCompraClick(tableMeta.rowData[5])}>
            Comprar
          </Button>
        ),
      },
    },
  ];

  const navigate = useNavigate();
  const [idEvento, setIdevento] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [col, setCol] = useState(columnsE);
  const [eventos, setEventos] = useState([]);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [dialogOpen3, setDialogOpen3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numEntradas, setNumEntradas] = useState('');
  const [numTarjeta, setNumTarjeta] = useState('');
  const [cvv, setCvv] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [error, setError] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [nombre, setNombre] = useState("");
  const [aforo, setAforo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [artista, setArtista] = useState("");
  const [precio, setPrecio] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [alerta, setAlerta] = useState("");

  const options = {
    filterType: 'checkbox',
    download: 'false',
    print: 'false',
    selectableRows: 'none'
  };

  useEffect(() => {

    axios.get('http://localhost:8080/user', { withCredentials: true })
      .then(response => {
        const data = response.data;
        setIdUsuario(data.id);
        if (response.data.rol == "empresa") {
          setCol(columnsEmp);
          axios({
            url: 'http://localhost:8080/eventos',
            method: 'POST',
            withCredentials: true,
            data: {
              id_empresa: idUsuario
            }
          })
            .then(response => {
              setEventos(response.data);
            })
            .catch(error => console.error(error));
        } else {
          setCol(columnsE);
          axios.post('http://localhost:8080/eventos')
            .then(response => {
              setEventos(response.data);
            })
            .catch(error => console.error(error));
        }
      })
      .catch(error => {
        axios.post('http://localhost:8080/eventos')
          .then(response => {
            setEventos(response.data);
          })
          .catch(error => console.error(error));
      });
      //Timeout alerta
      let timeout;

      if (alerta) {
        timeout = setTimeout(() => {
            setAlerta("");
        }, 5000); // 10 segundos
    }

    return () => {
        clearTimeout(timeout);
    };
  }, [idUsuario, idEvento,alerta],);

  const handleDeleteClick = (id) => {
    setIdevento(id);
    setDialogOpen3(true);
  };

  const handleBorrarSubmit = () => {
    axios({
      url: `http://localhost:8080/eventos/${idEvento}`,
      method: 'DELETE',
      withCredentials: true,
    })
      .then(res => {
        setAlerta("Se ha eliminado correctamente el evento");
        setDialogOpen3(false);
      }).catch(err => console.error(err))
  }

  const handleModificarClick = (id, event) => {
    setIdevento(id);
    console.log(event);
    console.log(id);
    setNombre(event[0]);
    setArtista(event[1]);
    setUbicacion(event[2]);
    setAforo(event[3]);
    setDescripcion(event[4]);
    setFecha(event[5]);
    setPrecio(event[6]);

    setDialogOpen2(true);

  };

  const handleActualizarClick = () => {

    const data = {
      nombre_evento: nombre,
      artista: artista,
      ubicacion: ubicacion,
      aforo: aforo,
      descripcion: descripcion,
      fecha_evento: fecha,
      precio: precio,
    };

    console.log(idEvento);

    axios.put(`http://localhost:8080/eventos/${idEvento}`
      , data, {
      withCredentials: true
    })
      .then(response => {
        
      })
      .catch(error => {
        console.error(error);
      });
      setAlerta("Se ha modificado correctamente el evento ");
      setDialogOpen2(false);
  };



  const handleCompraClick = id => {
    if (!idUsuario || idUsuario === "") {
      navigate('/login');
    } else {
      setIdevento(id);
      setDialogOpen1(true);
      console.log(id);
    }
  };

  const handlePagarClick = () => {
    setError(false);
    setLoading(true);

    const Datos = {
      id_usuario: idUsuario,
      id_evento: idEvento,
      datosBancarios: {
        numeroTarjeta: numTarjeta,
        codigoSeguridad: cvv,
        fechaExpiracion: fechaExpiracion,
      },
      num_entradas: numEntradas,
    };

    axios.post('http://localhost:8080/entradas/comprar', Datos, {
      withCredentials: true
    })
      .then(response => {
        console.log(response.data);
        setDialogOpen1(false);
        setLoading(false);
        setAlerta("La compra se ha realizado correctamente");
      })
      .catch(error => {
        setError(true);
        console.error(error);
        setLoading(false);
      });
  };

  const handleCloseClick = () => {
    setDialogOpen1(false);
    setDialogOpen2(false);
    setDialogOpen3(false);
    setError(false);
  };

  return (
    <>
      {alerta && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
            <Alert severity="success">
              {alerta}
            </Alert>
          </div>
        )}
      <MUIDataTable title={'Eventos Disponibles'} data={eventos} columns={col} options={options} />

      <Dialog open={dialogOpen1} onClose={handleCloseClick}>
        <DialogTitle>Comprar entradas</DialogTitle>
        <DialogContent>
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
              Error al realizarse el pago
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Número de entradas"
                value={numEntradas}
                onChange={event => setNumEntradas(event.target.value)}
                fullWidth
                margin="normal"
                type='number'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Número de tarjeta"
                value={numTarjeta}
                onChange={event => {
                  const inputValue = event.target.value;
                  if (/^\d{0,16}$/.test(inputValue)) {
                    setNumTarjeta(inputValue);
                  }
                }}
                fullWidth
                type='number'
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CVV"
                value={cvv}
                onChange={event => {
                  const inputValue = event.target.value;
                  if (/^\d{0,3}$/.test(inputValue)) {
                    setCvv(inputValue);
                  }
                }}
                fullWidth
                type='number'
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de expiración"
                value={fechaExpiracion}
                onChange={event => setFechaExpiracion(event.target.value)}
                fullWidth
                type='text'
                margin="normal"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button variant="contained" color="primary" startIcon={<AttachMoneyIcon />} onClick={handlePagarClick}>
                Pagar
              </Button>
              <Button variant="contained" onClick={handleCloseClick}>
                Cerrar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen2} onClose={handleCloseClick}>
        <DialogTitle>Modificar Evento</DialogTitle>
        <DialogContent>
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
              Error al realizarse el pago
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={event => setNombre(event.target.value)}
                fullWidth
                margin="normal"
                type='text'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="artista"
                label="Artistas"
                type="text"
                id="artista"
                onChange={event => setArtista(event.target.value)}
                value={artista}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                id="descripcion"
                label="Descripcion"
                name="descripcion"
                onChange={event => setDescripcion(event.target.value)}
                value={descripcion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="ubicacion"
                label="Ubicacion"
                type="text"
                id="ubicacion"
                onChange={event => setUbicacion(event.target.value)}
                value={ubicacion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField

                fullWidth
                name="fecha"
                label="Fecha del Evento"
                type="date"
                id="fecha"
                onChange={event => setFecha(event.target.value)}
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
                fullWidth
                name="precio"
                label="Precio"
                type="number"
                id="precio"
                onChange={event => setPrecio(event.target.value)}
                value={precio}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleActualizarClick}>
                Modificar
              </Button>
              <Button variant="contained" onClick={handleCloseClick}>
                Cerrar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogOpen3}
        onClose={handleCloseClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Seguro desea eliminar definitivamente esta Empresa?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Si elimina este evento , ten en cuenta que sera suprimida definitivamente
            de la base de datos y a todos los clientes que han comprado entradas de este
            evento se les devolverá el importe pagado.
            ¿Estás seguro que quieres eliminar este evento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClick}>Rechazar</Button>
          <Button onClick={handleBorrarSubmit} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Eventos;
