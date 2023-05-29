import express from "express";
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { strategyInit } from './lib/AuthStrategy.js';
import { router } from "./src/routes/endpoint.routes.js";
//Instanciamos express
const app = express();
app.use(express.json());
//app.use(cors());
//esto se usara para cuando tengamos el front y hagamos llamadas desde ahi desde el puerto 3000
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


// Inicialización del sistema de sesiones (adelantando temario del siguiente lab)
app.use(session({
  secret: 'cines-session-cookie-key', // Secreto de la sesión (puede ser cualquier identificador unívoco de la app, esto no es público al usuario)
  name: 'SessionCookie.SID', // Nombre de la sesión
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // Expiración de la sesión
  },
}));

app.use(passport.initialize()); // passport.initialize() inicializa Passport
app.use(passport.session()); // passport.session() indica a Passport que usará sesiones
strategyInit(passport);

app.use(router);

app.listen(8080, () => {
  console.log(`Servidor escuchando en el puerto 8080`)
})
