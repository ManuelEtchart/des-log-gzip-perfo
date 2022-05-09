import express from 'express';
import { mensajesMonDB } from './mensajes.js';
import { productoMonDB } from './productos.js';
import CarritoDaoMongoDB from './src/DAOs/carritoDaoMongoDB.js';
const carrito = express.Router();


const carritoMonDB = new CarritoDaoMongoDB();

carrito.use(express.json());
carrito.use(express.urlencoded({extended: true}));

carrito.get('', async (req,res)=>{
    try {
        res.render('carritos',{carritos: await carritoMonDB.getAll(), mensajes: await mensajesMonDB.getAll()})
    } catch (error) {
        console.log(error, "Hubo un error");
    }
})

carrito.post('', async (req,res) => {
    try {
        await carritoMonDB.save(
            {
                timestamp: Date.now(),
                productos: []
            }
        );
        res.redirect('/api/carrito')
    } catch (error) {
        console.log(error, "Hubo un error");
    }
})

carrito.delete('/:id', async (req,res) => {
    try {
        res.json(await carritoMonDB.deleteById(req.params.id))
    } catch (error) {
        console.log(error, "Hubo un error");
    }
});

carrito.get('/:id?/productos', async (req,res) => {
    if(req.params.id === undefined){
        res.render('carritos',{carritos: await carritoMonDB.getAll(), mensajes: await mensajesMonDB.getAll()})
    }else{
        res.render('carrito', {carritos: await carritoMonDB.getById(req.params.id), mensajes: await mensajesMonDB.getAll(), productos: await productoMonDB.getAll()})
    } 
})

carrito.post('/:id/productos/:id_prod', async (req,res) => {
    try {
        await carritoMonDB.agregarProductoEnCarrito(req.params.id, req.params.id_prod)
        res.render('carrito', {carritos: await carritoMonDB.getById(req.params.id), mensajes: await mensajesMonDB.getAll(), productos: await productoMonDB.getAll()})
    } catch (error) {
        console.log(error, "Hubo un error");
    }
})

carrito.delete('/:id/productos/:id_prod', async (req,res) => {
    try {
        res.json( await carritoMonDB.borrarProductoEnCarrito(req.params.id,req.params.id_prod))
    } catch (error) {
        console.log(error, "Hubo un error");
    }
})


export default carrito;