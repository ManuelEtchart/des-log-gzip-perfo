import express from 'express';
import minimist from 'minimist';
import compression from 'compression';
import path from 'path'
import hbs from 'express-handlebars'

const app = express();

app.use(compression());
//app.use(express.static('public'));

app.set('views', path.join(path.dirname(''), 'src/views'));

app.engine('.hbs', hbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}))

app.set('view engine', '.hbs');

import productos, { productoMonDB } from './productos.js';
import carrito from './carrito.js';
import mensajes, { mensajesMonDB } from './mensajes.js'

let options = {alias: {p: 'puerto'}};
let args = minimist(process.argv, options);

app.use('/api/carrito', carrito);
app.use('/api/productos', productos);
app.use('/api/mensajes', mensajes)

app.get('/', async (req,res)=>{
    res.redirect('/api/productos')
})

app.get('/api/info', async (req,res)=>{
    try {
        res.render('info',{
            datos:{
                argsEnt: process.argv.slice(2),
                nomPlat: process.platform,
                verNode: process.version,
                memToRev: JSON.stringify(process.memoryUsage().rss),
                pathExe: process.execPath,
                procId: process.pid,
                carProy: process.cwd()
            },
            mensajes: await mensajesMonDB.getAll()
        });
    } catch (error) {
        console.log(error, "Hubo un error");
    }
});

app.get('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
});
app.post('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
});
app.delete('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
});
app.put('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
});

const PORT = args.puerto || 8080;

const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));