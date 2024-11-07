//Reto Sensor fotoresistencia

const mysql = require("../database/db");
const constants = require("../constants");

// Obtener todos los registros de porcentaje
async function getLogPorcentaje(req, res) {
  try {
    const sql = constants.selectPorcentaje;
    const conn = mysql.getConnection();
    conn.connect((error) => {
      if (error) throw error;
      conn.query(sql, (error, data) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.json({ data });
        }
        conn.end();
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// Obtener registros de porcentaje por rango de fechas
async function getLogPorcentajeByDate(req, res) {
  try {
    const sql = constants.selectPorcentajeByDate;
    const { data_one, data_two } = req.body; // Cambiar 'date_one' y 'date_two' a 'data_one' y 'data_two'
    
    // Validar que las fechas están presentes
    if (!data_one || !data_two) {
      return res.status(400).send("Both data_one and data_two are required.");
    }
    
    const conn = mysql.getConnection();
    
    // Conectar y ejecutar la consulta
    conn.connect((error) => {
      if (error) {
        console.error("Database connection error:", error);
        return res.status(500).send("Database connection error.");
      }
      
      conn.execute(sql, [data_one, data_two], (error, data) => {
        if (error) {
          console.error("SQL error:", error);
          return res.status(500).send(error.message);
        } else {
          res.json({ data });
        }
        
        // Cerrar la conexión
        conn.end((closeError) => {
          if (closeError) {
            console.error("Error closing connection:", closeError);
          }
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("Unexpected server error.");
  }
}


async function insertLogPorcentaje(req,res){
    try{
  
      var sql = constants.insertPorcentaje;
  
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


module.exports = { getLogPorcentaje, getLogPorcentajeByDate, insertLogPorcentaje };