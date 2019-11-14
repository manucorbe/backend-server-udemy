// REQUIRES (IMPORTACION DE LIBRERIAS)
var express = require('express');
var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var bodyParser = require('body-parser');


// INICIALIZAR VARIABLES
var app = express();

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


//BODY PARSER
// parse application/x-www-form-urlencoded parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// IMPORTAR RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var facturaRoutes = require('./routes/factura');
var clienteRoutes = require('./routes/cliente');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');



// CONEXION DATA BASE
mongoose.connection.openUri('mongodb://localhost:27017/corberaDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});




//SERVER INDEX CONFIG
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));

// RUTAS
app.use('/', appRoutes);

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/factura', facturaRoutes);
app.use('/cliente', clienteRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);



// ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});