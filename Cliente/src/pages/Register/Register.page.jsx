import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { parse, isBefore, subYears } from 'date-fns';
import fondo from "../../img/fondoregistro.jpg"
import Alert from '@mui/material/Alert';
import validator from 'validator';


const theme = createTheme();

export default function Registro() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('usuario');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [cif, setCif] = useState("");
  const [fecha, setFecha] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [persona, setPersona] = useState("");
  const [capital, setCapital] = useState("");
  const [showClienteFields, setShowClienteFields] = useState(true);
  const [showEmpresaFields, setShowEmpresaFields] = useState(false);
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'radio') {
      setValue(value);
      setShowClienteFields(value === 'usuario');
      setShowEmpresaFields(value === 'empresa');
    } else if (name === 'email') {
      if (!validator.isEmail(value)) {  
        setAlerta('Email inválido!');  
      } 
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'passwordConf') {
      setPasswordConf(value);
    } else if (name === 'nombre') {
      setNombre(value);
    } else if (name === 'telefono') {
      setTelefono(value);
    } else if (name === 'dni') {
      setDni(value);
    } else if (name === 'cif') {
      setCif(value);
    } else if (name === 'fecha') {
      setFecha(value);
    } else if (name === 'apellidos') {
      setApellidos(value);
    } else if (name === 'domicilio') {
      setDomicilio(value);
    } else if (name === 'persona') {
      setPersona(value);
    } else if (name === 'capital') {
      setCapital(value);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      username === "" ||
      password === "" ||
      passwordConf === "" ||
      nombre === "" ||
      telefono === "" ||
      (value === "usuario" && (apellidos === "" || dni === "" || fecha === "")) ||
      (value === "empresa" && (cif === "" || domicilio === "" || persona === "" || capital === ""))
    ) {
      setAlerta("Por favor, completa todos los campos");
      return;
    }

    if (!validator.isEmail(username)) {  
      setAlerta('Email inválido!');
      return;  
    } 

    if (password !== passwordConf) {
      setAlerta("Las contraseñas deben coincidir");
      return;
    }

    if (value === 'usuario') {
      const fechaNacimiento = parse(fecha, 'yyyy-MM-dd', new Date());
      const limiteFecha = subYears(new Date(), 18);

      if (!isBefore(fechaNacimiento, limiteFecha)) {
        setAlerta('Debes ser mayor de edad para registrarte');
        return;
      }
    }


    const userData = {
      //Datos compartidos
      email: username,
      password: password,
      nombre: nombre,
      telefono: telefono,
      rol: value
    };

    // Verificar si es un usuario o una empresa
    if (value === 'usuario') {
      userData.apellidos = apellidos;
      userData.dni = dni;
      userData.fecha_nacimiento = fecha;
    } else if (value === 'empresa') {
      userData.cif = cif;
      userData.domicilio = domicilio;
      userData.persona_responsable = persona;
      userData.capital_social = capital;
    }

    // Enviar los datos al servidor
    axios.post('http://localhost:8080/register', userData)
      .then((response) => {

        if (value === 'empresa') {
          console.log(response.data.info); // Empresa registrada
        } else {
          console.log(response.data.info); // Usuario registrado
        }
        navigate('/login');
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          setAlerta(error.response.data.error);
        } else {
          setAlerta("Hubo un error en el registro");
        }
      });
  };



  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <Container component={Paper} maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registro
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {alerta && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                  <Alert severity="error">
                    {alerta}
                  </Alert>
                </div>
              )}
              <FormControl component="fieldset">
                <FormLabel component="legend">Seleccione el tipo de usuario</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="radio"
                  value={value}
                  onChange={handleChange}
                >
                  <div style={{ display: 'inline-block' }}>
                    <FormControlLabel
                      value="usuario"
                      control={<Radio />}
                      label="Cliente"
                      checked={value === 'usuario'}
                      onChange={handleChange}
                    />
                    <FormControlLabel
                      value="empresa"
                      control={<Radio />}
                      label="Promotor"
                      checked={value === 'empresa'}
                      onChange={handleChange}
                    />
                  </div>
                </RadioGroup>
              </FormControl>

              {showClienteFields && (
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
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
                        name="apellidos"
                        label="Apellidos"
                        type="text"
                        id="apellidos"
                        autoComplete="family-name"
                        onChange={handleChange}
                        value={apellidos}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={handleChange}
                        value={username}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                        value={password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        id="password"
                        label="Confirma contraseña"
                        name="passwordConf"
                        onChange={handleChange}
                        value={passwordConf}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="dni"
                        label="DNI"
                        type="text"
                        id="dni"
                        onChange={handleChange}
                        value={dni}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="fecha"
                        label="Fecha de Nacimiento"
                        type="date"
                        id="fechaNacimiento"
                        onChange={handleChange}
                        value={fecha}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="telefono"
                        label="Teléfono"
                        type="text"
                        id="telefono"
                        onChange={handleChange}
                        value={telefono}
                      />
                    </Grid>
                  </Grid>
                </div>
              )}

              {showEmpresaFields && (
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
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
                        id="cif"
                        label="CIF"
                        name="cif"
                        autoComplete="off"
                        onChange={handleChange}
                        value={cif}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        onChange={handleChange}
                        value={username}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                        value={password}
                      />
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="password"
                          id="password"
                          label="Confirma contraseña"
                          name="passwordConf"
                          onChange={handleChange}
                          value={passwordConf}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="domicilio"
                        label="Domicilio"
                        name="domicilio"
                        autoComplete="street-address"
                        onChange={handleChange}
                        value={domicilio}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="persona"
                        label="Pers. Responsable"
                        name="persona"
                        autoComplete="name"
                        onChange={handleChange}
                        value={persona}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="telefono"
                        label="Teléfono"
                        name="telefono"
                        autoComplete="tel"
                        onChange={handleChange}
                        value={telefono}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="socialCapital"
                        label="Capital Social"
                        name="capital"
                        autoComplete="off"
                        onChange={handleChange}
                        value={capital}
                      />
                    </Grid>
                  </Grid>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Registrarse</Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/home" variant="body2">
                    Volver
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    ¿Tienes una cuenta? Inicia Sesión
                  </Link>
                </Grid>

              </Grid>

            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
            {'Copyright © OC.IO '}
          </Typography>
        </Container>
      </div>
    </ThemeProvider>
  );
}