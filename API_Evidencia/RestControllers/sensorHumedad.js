const mysql = require("../database/db");
const constants = require("../constants");

async function getLogHumedad(req, res) {
  try {
    const sql = constants.selectHumedad;
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
    console.log(error);
    res.status(500).send(error);
  }
}

async function getLogHumedadByDate(req, res) {
  try {
    const sql = constants.selectHumedadByDate;
    const { fechaInicio, fechaFin } = req.body;
    const conn = mysql.getConnection();
    conn.connect((error) => {
      if (error) throw error;
      const params = [fechaInicio, fechaFin];
      conn.query(sql, params, (error, data) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.json({ data });
        }
        conn.end();
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function insertLogHumedad(req,res){
  try{

    var sql = constants.insertHumedad;

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
module.exports = { getLogHumedad, getLogHumedadByDate, insertLogHumedad };
