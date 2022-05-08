import express from 'express';
import minimist from 'minimist';
import compression from 'compression';

const app = express();

app.use(compression())
//app.use(express.static('public'));

import productos from './productos.js';
import carrito from './carrito.js';

let options = {alias: {p: 'puerto'}}
let args = minimist(process.argv, options)

app.use('/api/carrito', carrito);
app.use('/api/productos', productos);

app.get('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
})
app.post('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
})
app.delete('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
})
app.put('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
})
// // app.get('/info', (req,res)=>{
// //     res.render('info', {
// //        argsEnt: process.argv.slice(2),
// //        nomPlat: process.platform,
// //        verNode: process.version,
// //        memToRev: JSON.stringify(process.memoryUsage().rss),
// //        pathExe: process.execPath,
// //        procId: process.pid,
// //        carProy: process.cwd()
// //     })
// //  })

const PORT = args.puerto || 8080;

const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));