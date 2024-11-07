/**
 * //GIT IGNORE: https://github.com/github/gitignore/blob/main/Node.gitignore
 * 
 * Cómo debes configurar y usar tu API
 * 
 * 1. Instala todas las dependencias.
 *    1.1. Desde una terminal, accede a la carpeta del API donde se ubica este archivo (app.js)
 *    1.2. En la terminal ejecuta el comando:
 *         > npm install  //Instalará todas las dependencias necesarias.
 * 2. Debes crear un archivo .env en la carpeta raíz del projecto (donde está el archivo app.js). En las carpetas compartidas
 *    de drive dejaré un ejemplo del archivo.
 *    En el archivo env deberás inclir la información de tus credenciales para acceder a tu BD Aiven o Local.
 * 3. Para ejecutar el proyecto:
 *    3.1. Desde una terminal, ejecuta: node app.js -> Desde la carpeta raiz del proyecto (donde está el archivo app.js)
 *    3.2. Desde visual studio code, abre el archivo app.js y ejecuta debug. Selecciona como modo debug el propuesto (Node js)
 */


//Incluye en tu proyecto las dependencias necesarias
const constants = require("./constants")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./route')


/**
 * Paso 1: Crear el servidor con Express.
 */
const app = express();
const port = constants.serverPort;


/** 
 * Configuración del servidor web.
 * 1. Cors es una configuración requerida. 
 *     https://es.wikipedia.org/wiki/Intercambio_de_recursos_de_origen_cruzado#:~:text=El%20intercambio%20de%20recursos%20de,que%20sirvi%C3%B3%20el%20primer%20recurso. 
 * 2. BodyParser nos permitirá recibir información en un formato llamado JSON
 *    JavaScript Object Notation.
 */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Paso 2: Crear algunos endpoints básicos para el crud.
 * Para ver todos los endpoints agregados al momento, consulta el archivo /routes/route.js
 */
app.use(router);


// Primer endpoint que se crea en el app web. Simplemente respode un mensaje cuando haces una petición a la url: http://localhost:3000/
app.get("/", (req, res) => {
    res.send('Hello world!')
});

//arranque del server 
app.listen(port, () => {
    console.log('Server started running on : ' + port)
})