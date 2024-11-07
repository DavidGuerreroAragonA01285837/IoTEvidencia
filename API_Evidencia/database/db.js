const mysql = require('mysql2');
var fs = require("fs");
const constants = require("../constants")



/**
 * Método que configura un objeto conexión y lo regresa a quien lo solicite.
 * 
 * Instrucciones:
 * 
 * 1. Debes agregar en la carpeta raíz del proyecto un archivo .env donde configures variables de entorno.
 * 2. Configura la información de tu BD en las variables de entorno.
 * 3. Si estás usando Aiven, incluye tambien tu certificado SSL con una ruta válida de tu computadora.
 * 4. En la carpeta database te dejo compartido un archivo .sql para que puedas hacer restore de mi base de datos.
 */
function getConnection(){
  const connection = mysql.createConnection({
    host: constants.dbHost,
    user: constants.dbUser,
    port: constants.dbPort,
    password: constants.dbPass,
    database: "iot",
    dateStrings: true, //https://stackoverflow.com/questions/49475282/mysql-date-different-while-retrieving-from-node-js - Ignore timezone and use dates as strings
  });

  return connection;
}

module.exports = {getConnection};
