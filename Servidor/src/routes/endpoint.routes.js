import passport from 'passport'
import { login, register, crearEventos, listarEventos, empresasNoValidadas, pagar, usuario, logout, entradas , empresasValidadas ,validarEmpresa,actualizarPerfil, actualizarEvento,borrarEvento, borrarUsuario, subidaImagen} from '../controllers/endpoint.controllers.js';
import { Router } from 'express';
import { strategyInit } from '../../lib/AuthStrategy.js';

export const router = new Router();
router.use(passport.initialize()); // passport.initialize() inicializa Passport
router.use(passport.session()); // passport.session() indica a Passport que usará sesiones
strategyInit(passport);

//Endpoint que sirve para que el usuario se loguee(da igual que sea usuario o empresa)
router.post('/login', passport.authenticate('local'), login);

//Endpoint que sirve para que el usuario se registre
router.post("/register", register);

//Endpoint para dar de alta un nuevo evento
router.post('/eventos/crear', crearEventos);

//Endpoint GET para mostrar todos los eventos.
router.post('/eventos', listarEventos);

//Endpoint GET que lista las empresas promotoras de eventos que no están verificadas.
router.get('/empresas/noValidadas', empresasNoValidadas);



//Muestra las empresas validadas
router.get('/empresas/Validadas', empresasValidadas);

//Endpoint que se encarga de validar a una empresa
router.post('/empresas/validar', validarEmpresa);

//endpoint que realiza la transaccion del usuario
router.post('/entradas/comprar', pagar);

//devuelve las entradas del usuario
router.get("/entradas", entradas);

// Endpoint: GET /user --> Devuelve info del usuario en la sesión actual (y un 401 si no se ha iniciado sesión)
router.get("/user", usuario);

// Enpoint para actualiza perfil
router.put("/user/:id",actualizarPerfil);

router.delete("/user/:id",borrarUsuario)

router.put("/eventos/:id",actualizarEvento);

router.delete('/eventos/:id', borrarEvento);

// Endpoint: GET /logout finaliza la sesion existente
router.get("/logout", logout);

//subida imagen
router.post('/upload', subidaImagen, (req, res) => {
    try {
      const filename = req.file.filename;
      res.send({ data: 'imagen cargada', nombre: filename });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
});