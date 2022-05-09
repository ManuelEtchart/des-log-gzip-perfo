import express from 'express';
import { mensajesMonDB } from './mensajes.js';
import { loggerError, logger } from './server.js';
import ProductosDaoMongoDB from './src/DAOs/productosDaoMongoDB.js';

const productos = express.Router();

export const productoMonDB = new ProductosDaoMongoDB();

productos.use(express.json());
productos.use(express.urlencoded({extended: true}));

const administrador = true;

productos.get('/form', async (req,res)=>{
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    res.render('productosForm', {mensajes: await mensajesMonDB.getAll()});
});

productos.get('/:id?', async (req,res) => {
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    try {
        if (req.params.id === undefined) {
            res.render('inicio', {productos: await productoMonDB.getAll(), mensajes: await mensajesMonDB.getAll()})
        }else{
            res.render('producto',{producto: await productoMonDB.getById(req.params.id), mensajes: await mensajesMonDB.getAll()})
        }
    } catch (error) {
        loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
    }
});

productos.post('', async (req,res) => {
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
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
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada - Ruta no autorizada`)
            res.send({error: '-1', descripcion: `ruta ${req.url} metodo ${req.method} no autorizada`});
        }
    }catch(error){
        loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`);
    }
});

productos.put('/:id', async (req,res) => {
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    try {
        if(administrador){
            res.json(await productoMonDB.updateById(req.params.id, req.query));
        }else{
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada - Ruta no autorizada`)
            res.send({error: '-1', descripcion: `ruta ${req.url} metodo ${req.method} no autorizada`});
        }
    } catch (error) {
        loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
    }
})

productos.delete('/:id', async (req,res) => {
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    try {
        if(administrador){
            res.json(await productoMonDB.deleteById(req.params.id))
        }else{
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada - Ruta no autorizada`)
            res.send({error: '-1', descripcion: `ruta ${req.url} metodo ${req.method} no autorizada`});
        }
    } catch (error) {
        loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
    }
})

export default productos;
