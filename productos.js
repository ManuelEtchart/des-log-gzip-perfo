import express from 'express';
import { mensajesMonDB } from './mensajes.js';
import ProductosDaoMongoDB from './src/DAOs/productosDaoMongoDB.js';

const productos = express.Router();

export const productoMonDB = new ProductosDaoMongoDB();

productos.use(express.json());
productos.use(express.urlencoded({extended: true}));

const administrador = true;

productos.get('/form', async (req,res)=>{
    res.render('productosForm', {mensajes: await mensajesMonDB.getAll()});
});

productos.get('/:id?', async (req,res) => {
    try {
        if (req.params.id === undefined) {
            res.render('inicio', {productos: await productoMonDB.getAll(), mensajes: await mensajesMonDB.getAll()})
        }else{
            res.render('producto',{producto: await productoMonDB.getById(req.params.id), mensajes: await mensajesMonDB.getAll()})
        }
    } catch (error) {
        console.log(error, "Hubo un error");
    }
});

productos.post('', async (req,res) => {
    try{
        if(administrador){
            
            await productoMonDB.save({
                timestamp: Date.now(),
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                codigo: req.body.codigo,
                foto: req.body.urlFoto,
                precio: req.body.precio,
                stock: req.body.stock
            });

            res.redirect('/')
            
        }else{
            res.send({error: '-1', descripcion: `ruta ${req.url} metodo ${req.method} no autorizada`});
        }
    }catch(error){
        console.log(error, "Hubo un error");
    }
});

productos.put('/:id', async (req,res) => {
    try {
        if(administrador){
            res.json(await productoMonDB.updateById(req.params.id, req.query));
        }else{
            res.send({error: '-1', descripcion: `ruta ${req.url} metodo ${req.method} no autorizada`});
        }
    } catch (error) {
        console.log(error, "Hubo un error");
    }
})

productos.delete('/:id', async (req,res) => {
    try {
        if(administrador){
            res.json(await productoMonDB.deleteById(req.params.id))
        }else{
            res.send({error: '-1', descripcion: `ruta ${req.url} metodo ${req.method} no autorizada`});
        }
    } catch (error) {
        console.log(error, "Hubo un error");
    }
    
})

export default productos;
