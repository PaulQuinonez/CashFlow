require('dotenv').config();
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

//* INICIAMOS SERVIDOR
const server = http.createServer(app);
server.listen(port, function(){
    console.clear();
    console.log("****************************************************************");
    console.log("*                      SERVIDOR: CASH FLOW                     *");
    console.log("****************************************************************");
    console.log(`*      Servidor corriendo en: http://localhost:${port}/api/CF/    *`);
    console.log("*                       CONEXION CORRECTA                      *");
    console.log("****************************************************************");
})