const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/config/config');

//* Inicialización de express
const app = express();

//* RUTAS
const user_routes = require('./src/routes/user.routes');
const auth_routes = require('./src/routes/auth.routes');
const transaction_routes = require('./src/routes/transaction.routes');
const type_routes = require('./src/routes/type.routes');


//* CONEXION A BASE DE DATOS
db();

// TODO: HABILITACIÓN DE LAS SOLICITUDES CRUZADAS
app.use(cors());

//* CONFIGURACION ADICIONAL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use((req, res, next) => {
    res.header('Content-Type: application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// TODO: RUTAS PRINCIPALES
app.use('/api/CF/auth', auth_routes);
app.use('/api/CF/user', user_routes);
app.use('/api/CF/transaction', transaction_routes);
app.use('/api/CF/type', type_routes);

module.exports = app;
