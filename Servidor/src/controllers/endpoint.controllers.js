import Knex from 'knex';
import { development } from "../../knexfile.js";
import Evento from "../../models/Evento.model.js";
import Usuario from "../../models/Usuario.model.js";
import Transaccion from "../../models/Transacciones.model.js";
import axios from 'axios';

//Conexión a la base de datos
const dbConnection = Knex(development);
Evento.knex(dbConnection);
Usuario.knex(dbConnection);
Transaccion.knex(dbConnection);

//Funcion que sirve para que el usuario se loguee(da igual que sea usuario o empresa)
export const login = (req, res) => {
    if (!!req.user) res.status(200).json(req.user)
    else res.status(401).json({ error: "Credenciales incorrectas" });
};

//Endpoint que sirve para que el usuario se registre
export const register = (req, res) => {
    const dbQuery = Usuario.query();
    dbQuery.findOne({ email: req.body.email }).then(async result => {
        if (!!result) res.status(500).json({ error: "El usuario ya existe" });
        else {
            dbQuery.insert({
                email: req.body.email,
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                dni: req.body.dni,
                cif: req.body.cif,
                fecha_nacimiento: req.body.fecha_nacimiento,
                domicilio: req.body.domicilio,
                telefono: req.body.telefono,
                persona_responsable: req.body.persona_responsable,
                capital_social: req.body.capital_social,
                rol: req.body.rol,
                isVerified: false,
                unsecurePassword: String(req.body.password)
            }).then(insertResult => {
                if (req.body.rol === "empresa") {
                    res.status(200).json({ info: "Empresa registrada" });
                } else {
                    res.status(200).json({ info: "Usuario registrado" });
                }
            }).catch(error => {
                res.status(500).json({ info: "Error en el registro", error: error.message });
            })
        }

    })
};

//Endpoint para dar de alta un nuevo evento
export const crearEventos = async (req, res) => {
    const {
        id_empresa,
        nombre_evento,
        artista,
        ubicacion,
        aforo,
        descripcion,
        fecha_evento,
        precio,
    } = req.body;

    const dbQuery = Usuario.query();

    try {
        const empresa = await dbQuery.findOne({ id: req.body.id_empresa, rol: 'empresa' });
        if (!empresa) {
            return res.status(500).json({ error: "La empresa no existe" });
        }

        if (!empresa.isVerified) {
            return res.status(500).json({ error: "La empresa no está verificada" });
        }

        const evento = await Evento.query().insert({
            id_empresa,
            nombre_evento,
            artista,
            ubicacion,
            aforo,
            descripcion,
            fecha_evento,
            precio,
        });

        res.status(201).json({ info: "Evento registrado", evento });
    } catch (error) {
        res.status(500).json({ error });
    }
};

//Función que sirve para mostrar todos los eventos.
export const listarEventos = async (req, res) => {
    try {
        if (!!req.body.id) {
            const misEventos = await Evento.query().findById(req.body.id).where('fecha_evento', '>', new Date());
            return res.status(200).json(misEventos);
        }
        if (!!req.body.id_empresa) {
            const eventosEmp = await Evento.query().where({ id_empresa: req.body.id_empresa }).andWhere('fecha_evento', '>', new Date());
            return res.status(200).json(eventosEmp);
        }

        const eventos = await Evento.query().where('fecha_evento', '>', new Date());
        return res.status(200).json(eventos);

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Función que lista las empresas promotoras de eventos que no están verificadas.
export const empresasNoValidadas = async (req, res) => {
    try {
        const empresas = await Usuario.query().where('rol', 'empresa').where('isVerified', false);
        res.status(200).json(empresas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener empresas' });
    }
};

//funcion que devuelve las empresas validadas
export const empresasValidadas = async (req, res) => {
    try {
        const empresas = await Usuario.query().where('rol', 'empresa').where('isVerified', true);
        res.status(200).json(empresas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener empresas' });
    }
};



//endpoint que realiza la transaccion del usuario
export const pagar = async (req, res) => {
    try {
        const { id_usuario, id_evento, datosBancarios, num_entradas } = req.body;
        const evento = await Evento.query().findById(id_evento);
        if (!evento) {
            return res.status(500).json({ error: "El evento no existe" });
        }
        const precio = evento.precio;
        const entradas = evento.aforo;
        const precio_final = precio * req.body.num_entradas;
        const entradas_final = entradas - req.body.num_entradas;

        if (evento.aforo <= req.body.num_entradas) {
            return res.status(500).json({ error: "No queda aforo disponible" });
        }

        const response = await axios.post('https://pse-payments-api.ecodium.dev/payment', {
            clientId: id_usuario,
            paymentDetails: {
                creditCard: {
                    cardNumber: datosBancarios.numeroTarjeta,
                    cvv: datosBancarios.codigoSeguridad,
                    expiresOn: datosBancarios.fechaExpiracion,
                },
                totalAmount: precio_final,
            },
        });

        //modificamos el parametro entradas de la tabla eventos restandole las entradas adquiridas
        await Evento.query().findById(id_evento).patch({
            aforo: entradas_final
        });

        // Guardar la respuesta en la base de datos
        const transaccion = await Transaccion.query().insert({
            id_usuario,
            id_evento,
            codigo: response.data._id,
            num_entradas,
        });
        // Lógica para guardar la transacción en la base de datos

        res.status(201).json({ info: "Compra realizada con éxito", transaccion, precio_final });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

//endpoint que valida la empresa deseada
export const validarEmpresa = async (req, res) => {
    const dbQuery = Usuario.query();
    try {
        await dbQuery.findById(req.body.id_empresa).patch({
            isVerified: true
        });
        res.status(201).json({ info: "Empresa validada!!!" });
    } catch (err) {
        res.status(400).json({ error: "Error al validar la empresa", err });
    }
};

//Devuelve las entradas del usuario
export const entradas = async (req, res) => {
    const dbQuery = Transaccion.query();
    try {
        if (!!req.isAuthenticated()) {
            const entradas = await dbQuery.where({ id_usuario: req.user.id });
            if (!entradas) {
                return res.status(200).json({ error: "No ha realizado ninguna compra" });
            } else {
                return res.status(200).json(entradas);
            }
        } else {
            return res.status(500).json({ message: 'No ha iniciado sesion' });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Devuelve info del usuario en la sesión actual (y un 401 si no se ha iniciado sesión)
export const usuario = (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.user) : res.status(401).send('Sesión no iniciada!');

// Endpoint: GET /logout finaliza la sesion existente
export const logout = (req, res) => {
    req.logOut({}, (err) => {
        if (!!err) res.status(500).json(err)
        else res.status(200).json({ status: "Ok" });
    })
};

export const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;
    if (rol == "usuario") {
        const { nombre, apellidos, dni, fecha_nacimiento, telefono, password } = req.body;

        await Usuario.query().findById(id).patch({
            nombre,
            apellidos,
            dni,
            fecha_nacimiento,
            telefono,
            password
        });

    } else {
        const { nombre, cif, password, domicilio, telefono, capital_social, persona_responsable } = req.body;
        await Usuario.query().findById(id).patch({
            nombre,
            cif,
            domicilio,
            capital_social,
            telefono,
            password,
            persona_responsable
        });
    }
}

export const actualizarEvento = async (req, res) => {
    const { id } = req.params;
    const {
        nombre_evento,
        artista,
        ubicacion,
        aforo,
        descripcion,
        fecha_evento,
        precio,
    } = req.body;

    try {
        await Evento.query().findById(id).patch({
            nombre_evento,
            artista,
            ubicacion,
            aforo,
            descripcion,
            fecha_evento,
            precio,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const borrarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const borrar = await Evento.query().findById(id).delete();
        res.status(200).json({ info: "El evento ha sido eliminada" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const borrarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const borrar = await Usuario.query().findById(id).delete();
        res.status(200).json({ info: "El usuario ha sido eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};