import express from 'express';
import MensajesDaoMongoDB from './src/DAOs/mensajesDaoMongoDB.js';
import {faker} from '@faker-js/faker';


const mensajes = express.Router();

const mensajesMonDB = new MensajesDaoMongoDB();

mensajes.use(express.json());
mensajes.use(express.urlencoded({extended: true}));

mensajes.post('', (req,res) =>{
    const mensaje = {
       email: req.body.email,
       nombre: req.body.nombreMensaje,
       apellido: req.body.apellido,
       edad: req.body.edad,
       alias: req.body.alias,
       mensaje: req.body.mensaje
    }
    let fechaActual = new Date();
    mensaje.fecha = `[(${fechaActual.getDay()}/${fechaActual.getMonth()}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}:${fechaActual.getSeconds()})]`;
    mensaje.avatar = faker.image.avatar();
    mensajesMonDB.save(mensaje)
    res.json({mensajes: mensajesMonDB.getAll()});
});

export default mensajes