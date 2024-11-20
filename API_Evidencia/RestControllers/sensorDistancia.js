const mysql = require("../database/db");
const constants = require("../constants")



/**
  * Endpoint #1. getLogDistancia
  * 
  * Este método realiza un select de todos los registros ubicados en
  * una tabla llamada "sensor_Distancia".
  * 
  * Resultado: Obtendrá todos los registros de la tabla "sensor_Distancia" 
  * Todas las columnas están contempladas. 
  * 
  * Puedes sustituirla utilizando una proyección a tu tabla incluyendo las columnas que necesites.
  * 
  * Te servirá para crear reportes especializados si utilizas algún metodo de despliegue web para los
  * Dashboards.
  */
async function getLogDistance(req,res){
  try{

    var sql = constants.selectDistance;
    var conn = mysql.getConnection();
    conn.connect((error)=>{
        if (error) throw error;
        conn.query(sql, (error, data, fields) => {
            if (error) {
              res.status(500);
              res.send(error.message);
            } else {
              console.log(data);
              res.json({
                data,
              });
            }
            conn.end();
        });
    });
  }catch(error){
    console.log(error)
    res.status(500)
    res.send(error)
  }
}


/**
  * Endpoint #2. getLogByDistance
  * 
  * Este método realiza un select de todos los registros ubicados en
  * una tabla llamada "sensor_temperatura" que se encuentren entre dos fechas.
  * 
  * Resultado: Obtendrá todos los registros de la tabla "sensor_temperatura" 
  * Todas las columnas están contempladas. Se regresa solo los valores generados entre dos fechas
  * 
  * Puedes sustituirla utilizando una proyección a tu tabla incluyendo las columnas que necesites.
  * 
  * Te servirá para crear reportes especializados si utilizas algún metodo de despliegue web para los
  * Dashboards.
  */
async function getLogByDistance(req,res){
  try{
    var sql = constants.selectByDistance;

    var distance_one = req.body.distance_one;
    var distance_two = req.body.distance_two;

    var conn = mysql.getConnection();
    conn.connect((error)=>{
        if (error) throw error;
        var params = [distance_one,distance_two];
        conn.execute(sql, params, (error, data, fields) => {
            if (error) {
              res.status(500);
              res.send(error.message);
            } else {
              console.log(data);
              res.json({
                data,
              });
            }
            conn.end();
        });
    });
  }catch(error){
    console.log(error)
    res.status(500)
    res.send(error)
  }
  
}



/**
  * Endpoint #3. insertLogDistance
  * 
  * Este método realiza un insert sobre la tabla "sensor_temperatura".
  * Deberás enviar todos los datos desde tu sensor a este endpoint.
  * 
  * Sustituye:
  *    1. El nombre de tu tabla.
  *    2. Las columnas correspondientes a tu tabla en la Base de Datos.
  *    3. Realiza el insert
  * 
  * Consideraciones:
  *   a. Solo se especificaron 2 columnas (el valor leido, y por fecha de registro se indica la fecha actual al momento.)
  *   b. Debes sustituir los valores de las columnas de tu tabla
  *   c. Si tienes un id que no se autogenere, deberás enviarlo tambien
  *  
  */
async function insertLogDistance(req,res){
  try{

    var sql = constants.insertDistance;

    //el valor se recibe en el cuerpo de correo
    //cualquier dato que vaya a ir en el insert deberás guardarlo en una variable local
    var valor = req.body.valor;

    var conn = mysql.getConnection();
    conn.connect((error)=>{
        if (error) throw error;

        // así mismo, cualquier dato que vaya a insertarse, deberá incluirse en
        // los valores de los parámetros del Insert
        var params = [valor]; 
        conn.execute(sql, params, (error, data, fields) => {
            if (error) {
              res.status(500);
              res.send(error.message);
            } else {
              console.log(data);
              res.json({
                status: 200,
                message: "Valor insertado",
                affectedRows: data.affectedRows,
              });
            }
            conn.end();
        });
    });

  }catch(error){
    console.log(error)
    res.status(500)
    res.send(error)
  }
  
}

async function getRefDistance(req, res) {
  try {
    const sql = constants.refillDist; // Query string
    const conn = mysql.getConnection(); // Get connection instance

    conn.connect((error) => {
      if (error) throw error;

      conn.query(sql, (error, data, fields) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          // Assuming `data` is an array of rows and we need the first column's value from the first row
          const value = data.length > 0 ? data[0][Object.keys(data[0])[0]] : null;
          res.send(value !== null ? String(value) : ""); // Send only the number as a string
        }
        conn.end();
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}



module.exports = {insertLogDistance, getLogDistance,getLogByDistance,getRefDistance};
