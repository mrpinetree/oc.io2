import { useEffect } from 'react';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header.component';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Grid, Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useState } from 'react';
import { addYears } from 'date-fns';
import bcrypt from 'bcryptjs';

const theme = createTheme();

export const Perfil = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [rol, setRol] = useState("");
    const [error, setError] = useState("");
    const [passwordEnc, setPasswordEnc] = useState("");
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
    const [tipo, setTipo] = useState("");
    const [open, setOpen] = useState(false);
    const mayorEdad = addYears(new Date(), -18).toISOString().split("T")[0];
    const [alerta, setAlerta] = useState("");


    useEffect(() => {
        axios({
            url: 'http://localhost:8080/user',
            method: 'GET',
            withCredentials: true,
        })
            .then(res => {
                console.log("r" + res.data.fecha_nacimiento);
                document.title = `Mi Perfil`;
                setId(res.data.id);
                setRol(res.data.rol);
                if (res.data.rol == "usuario") {
                    setTipo("usuario");
                    setNombre(res.data.nombre);
                    setApellidos(res.data.apellidos);
                    setDni(res.data.dni);
                    setFecha(moment(res.data.fecha).format('YYYY/MM/DD'));
                    setTelefono(res.data.telefono);
                    setPasswordEnc(res.data.password);
                } else {
                    setTipo("empresa");
                    if (res.data.isVerified == false) {
                        navigate('/');
                    }
                    setNombre(res.data.nombre);
                    setCif(res.data.cif);
                    setDomicilio(res.data.domicilio);
                    setTelefono(res.data.telefono);
                    setCapital(res.data.capital_social);
                    setPersona(res.data.persona_responsable);
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

        if (error) {
            timeout = setTimeout(() => {
                setError("");
            }, 5000); // 10 segundos
        }


        return () => {
            clearTimeout(timeout);
        };
    }, [id, tipo, alerta, error],);

    const handleSubmit = () => {
        setAlerta("");
        setError("");
        let dato = {};

        if (!password) {
            if (tipo == "usuario") {
                dato = {
                    nombre,
                    apellidos,
                    dni,
                    fecha_nacimiento: fecha,
                    telefono,
                    rol
                    //password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                }
            } else {
                dato = {
                    nombre,
                    cif,
                    domicilio,
                    capital_social: capital,
                    telefono,
                    rol,
                    //password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                    persona_responsable: persona
                }
            }
        } else {
            if (password != passwordConf) {
                setError("Las contraseñas deben coincidir");
                return;
            } else {
                const compareMatch = bcrypt.compareSync(password, passwordEnc);
                if (compareMatch) {
                    setError("La contraseña no puede ser igual a la anterior");
                    return;
                } else {
                    if (tipo == "usuario") {
                        dato = {
                            nombre,
                            apellidos,
                            dni,
                            fecha_nacimiento: moment(fecha).format('YYYY/MM/DD'),
                            telefono,
                            rol,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                        }
                    } else {
                        dato = {
                            nombre,
                            cif,
                            domicilio,
                            capital_social: capital,
                            telefono,
                            rol,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                            persona_responsable: persona
                        }
                    }
                }
                setError("La contraseña ha sido modificada con exito");
            }

        }
        setAlerta("Los datos se han modificado correctamente");

        axios({
            url: `http://localhost:8080/user/${id}`,
            method: 'PUT',
            withCredentials: true,
            data: dato,
        }).then(response => {
            navigate("/home/perfil");
        }).catch(err => console.error(err))
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nombre':
                setNombre(value);
                break;
            case 'apellidos':
                setApellidos(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'passwordConf':
                setPasswordConf(value);
                break;
            case 'dni':
                setDni(value);
                break;
            case 'fecha':
                setFecha(value);
                break;
            case 'telefono':
                setTelefono(value);
                break;
            case 'domicilio':
                setDomicilio(value);
                break;
            case 'persona':
                setPersona(value);
                break;
            case 'capital':
                setCapital(value);
                break;
            case 'cif':
                setCif(value);
                break;
            default:
                break;
        }
    };

    const handleBorrar = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const borrar = () => {
        axios({
            url: `http://localhost:8080/user/${id}`,
            method: 'DELETE',
            withCredentials: true,
        })
            .then(res => {
                navigate('/');
                res.status(500).json({ message: 'Usuario eliminada' });
            }).catch(err => console.error(err))
    }


    return (
        <ThemeProvider theme={theme}>
            <Header />
            {alerta && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                    <Alert severity="success">
                        {alerta}
                    </Alert>
                </div>
            )}
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', mt: 3
                    }}
                >
                    <Typography component="h1" variant="h3" marginBottom={2} fontFamily={'Serif'}>
                        Mi Perfil
                    </Typography>
                    {error && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </div>
                    )}

                    {tipo == "usuario" && (
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="nombre"
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
                                        fullWidth
                                        name="apellidos"
                                        label="Apellidos"
                                        type="text"
                                        id="apellidos"
                                        onChange={handleChange}
                                        value={apellidos}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        id="password"
                                        label="Contraseña"
                                        name="password"
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
                                        fullWidth
                                        name="dni"
                                        label="Dni"
                                        type="text"
                                        id="dni"
                                        onChange={handleChange}
                                        value={dni}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="fecha"
                                        label="Fecha de nacimiento"
                                        type="date"
                                        id="fecha"
                                        onChange={handleChange}
                                        value={fecha}
                                        InputLabelProps={{
                                            shrink: true,
                                            max: mayorEdad
                                        }}
                                        inputProps={{
                                            max: mayorEdad,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="telefono"
                                        label="Telefono"
                                        type="number"
                                        id="telefono"
                                        onChange={handleChange}
                                        value={telefono}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    )}
                    {tipo == "empresa" && (
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="nombre"
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
                                        fullWidth
                                        name="cif"
                                        label="CIF"
                                        type="text"
                                        id="cif"
                                        onChange={handleChange}
                                        value={cif}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        id="password"
                                        label="Contraseña"
                                        name="password"
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
                                        fullWidth
                                        name="domicilio"
                                        label="Domicilio"
                                        type="text"
                                        id="domicilio"
                                        onChange={handleChange}
                                        value={domicilio}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="telefono"
                                        label="Telefono"
                                        type="number"
                                        id="telefono"
                                        onChange={handleChange}
                                        value={telefono}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="capital"
                                        label="Capital"
                                        type="number"
                                        id="capital"
                                        onChange={handleChange}
                                        value={capital}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="persona"
                                        label="Persona"
                                        type="text"
                                        id="persona"
                                        onChange={handleChange}
                                        value={persona}
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
                        Modificar
                    </Button>

                    <Button
                        onClick={handleBorrar}
                        type="submit"
                        color="error"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Eliminar Cuenta</Button>
                </Box>
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"¿Seguro desea eliminar definitivamente su Cuenta?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Si elimina su cuenta, ten en cuenta que sera suprimida definitivamente
                        de la base de datos y debera volver a registrarse en el sistema.
                        ¿Estás seguro que quieres eliminar esta cuenta?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Rechazar</Button>
                    <Button onClick={borrar} autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider >
    );
};