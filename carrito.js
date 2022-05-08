import express from 'express';
import CarritoDaoMongoDB from './src/DAOs/carritoDaoMongoDB.js';
const carrito = express.Router();


const carritoMonDB = new CarritoDaoMongoDB();

carrito.use(express.json());
carrito.use(express.urlencoded({extended: true}));

carrito.post('', async (req,res) => {
    try {
        res.json(await carritoMonDB.save(
            {
                timestamp: Date.now(),
                productos: []
            }
        ));
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
        res.send(await carritoMonDB.getAll())
    }else{
        res.json(await carritoMonDB.getById(req.params.id))
    } 
})

carrito.post('/:id/productos/:id_prod', async (req,res) => {
    try {
        res.json(await carritoMonDB.agregarProductoEnCarrito(req.params.id, req.params.id_prod))
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