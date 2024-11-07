const mysql = require("../database/db");
const constants = require("../constants");

/**
 * Endpoint #1. resetAll
 * 
 * Este método resetea varios registros en diferentes tablas de la base de datos.
 */
async function resetAll(req, res) {
    const sqlQueries = [
        constants.resetDistance,
        constants.resetHumidity,
        constants.resetLight,
        constants.resetPresence,
        constants.resetTemperature
    ];

    const conn = mysql.getConnection();
    
    conn.connect((error) => {
        if (error) {
            console.error('Database connection error:', error);
            return res.status(500).send('Database connection error.');
        }

        // Use Promise.all to handle multiple queries
        Promise.all(sqlQueries.map(sql => {
            return new Promise((resolve, reject) => {
                conn.query(sql, (error, data) => {
                    if (error) {
                        reject(error.message);
                    } else {
                        console.log(data);
                        resolve(data);
                    }
                });
            });
        }))
        .then(results => {
            // Sending a consolidated response for all queries
            res.json({
                message: 'All tables reset successfully.',
                results: results,
            });
            conn.end();
        })
        .catch(err => {
            console.error('Error executing queries:', err);
            res.status(500).send(err);
            conn.end();
        });
    });
}

module.exports = { resetAll };
