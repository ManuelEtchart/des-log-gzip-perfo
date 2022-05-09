import express from 'express';
import minimist from 'minimist';
import compression from 'compression';
import { cpus } from 'os';
import path from 'path';
import log4js from 'log4js';
import hbs from 'express-handlebars';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import productos from './productos.js';
import carrito from './carrito.js';
import mensajes, { mensajesMemoria } from './mensajes.js';

const app = express();

app.use(compression());
//app.use(express.static('public'));

log4js.configure({
    appenders:{
        logConsola: {type: 'console'},
        logError: {type: 'file', filename: 'error.log'},
        logWarn: {type: 'file', filename: 'warn.log'},
        loggerWarn: {type: 'logLevelFilter', appender: 'logWarn', level: 'warn'},
        loggerError: {type: 'logLevelFilter', appender: 'logError', level: 'error'}
        
    },
    categories:{
        default:{
            appenders: ["loggerError", "logConsola"], level: "all"
        },
        custom:{
            appenders: ["loggerWarn", "logConsola"], level: "all"
        }
    }
});

export const logger = log4js.getLogger('custom');
export const loggerError = log4js.getLogger();

app.set('views', path.join(path.dirname(''), 'src/views'));

app.engine('.hbs', hbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}))

app.set('view engine', '.hbs');

app.use(cookieParser())
app.use(session({
   secret: '123456789!#$%&/()',
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: 'auto',
      maxAge: 600000
   }
}));

let options = {alias: {p: 'puerto'}};
let args = minimist(process.argv, options);

app.use('/api/carrito', carrito);
app.use('/api/productos', productos);
app.use('/api/mensajes', mensajes);

app.get('/', (req,res)=>{
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    res.redirect('/api/productos')
});

app.get('/api/info', async (req,res)=>{
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    try{
        console.log({
            cpus: cpus.length,
            argsEnt: process.argv.slice(2),
            nomPlat: process.platform,
            verNode: process.version,
            memToRev: JSON.stringify(process.memoryUsage().rss),
            pathExe: process.execPath,
            procId: process.pid,
            carProy: process.cwd()
        });
        res.render('info',{
            datos:{
                cpus: cpus.length,
                argsEnt: process.argv.slice(2),
                nomPlat: process.platform,
                verNode: process.version,
                memToRev: JSON.stringify(process.memoryUsage().rss),
                pathExe: process.execPath,
                procId: process.pid,
                carProy: process.cwd()
            },
            mensajes: await mensajesMemoria.getAll()
        });
    } catch (error) {
        loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
    }
});

/*app.get('/api/randoms', (req,res) => {
    logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
    console.log('no bloqueante antes')
    const randoms = fork('./random.js')
    randoms.send({query: req.query.cant})
    randoms.on('message', randoms =>{
       res.render('random', {random: JSON.stringify(randoms)})
    })
    console.log('no bloqueante despues')
})
*/
app.get('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
    logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
});
app.post('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
    logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
});
app.delete('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
    logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
});
app.put('*', (req,res) => {
    res.send({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`});
    logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
});

const PORT = args.puerto || 8080;

const server = app.listen(PORT, () => {
   logger.info(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => loggerError.error(error, `Error en servidor ${error}`) ); 