
/*
 * LOCAL DATABASE Config
 * 
 *  Para acceder a una BD en la nube debes configurar un archivo .env
 */
const dbHost = "mysql-2767622c-tec-22a8.b.aivencloud.com";
const dbPort = "12896";
const dbUser = "avnadmin";
const dbPass = "AVNS_ueLuCZuNiP13plMDljB";
const dbName = "defaultdb";



/*
 * Server General Configuration
 */
const serverPort = 3000
const contextURL = '/iot'; //If needed, project context
const api = '/api'; // Sugested API URL

//SENSOR 1 URLS. Configurar URLS por cada sensor.
const getTemperatureSensor = '/getTemperatures'
const getTemperatureSensorByDate = '/getTemperatures'
const postTemperatureSensor = '/insertTemperature'; //Implemented Endpoint URL
//SENSOR 2 URLS. Configurar URLS por cada sensor.
const getPresenceSensor = '/getPresence'
const getPresenceSensorByDate = '/getPresence'
const postPresenceSensor = '/insertPresence'; //Implemented Endpoint URL

//SENSOR 3 URLS. Configurar URLS por cada sensor.
const getDistanceSensor = '/getDistance'
const getByDistance = '/getDistance'
const postDistanceSensor = '/insertDistance'; //Implemented Endpoint URL

// URLS de los Endpoints de sensor_humedad
const getHumedadSensor = '/getHumedad';
const getHumedadSensorByDate = '/getHumedadByDate';
const postHumedadSensor = '/insertHumedad'; 

//SENSOR 5 URLS. Configurar URLS por cada sensor.
const getFotoresistence = '/getPorcentaje'
const getFotoresistenceByDate = '/getPorcentaje'
const postFotoresistence = '/insertPorcentaje'; //Implemented Endpoint URL

//Datos relacionales 1
const getTermicalSensation = '/getST'
const postTermicalSensation = '/insertST'; //Implemented Endpoint URL

// URL to reset

const resetRegisters = '/resetRegisters'

/*
 * DB Queries
 * Agregar queries por sensor.
 */
const selectTemperature = 'SELECT * FROM temps';
const selectTemperatureByDate = 'SELECT * FROM temps WHERE fecha between ? and ?';
const insertTemperature = 'INSERT INTO temps (valor) values (?)';

// Queries para sensor de presencia
const selectPresence = 'SELECT * FROM presence';
const selectPresenceByDate = 'SELECT * FROM presence WHERE fecha between ? and ?';
const insertPresence = 'INSERT INTO presence (deteccion) values (?)';

// Queries para sensor de Distancia
const selectDistance = 'SELECT * FROM distance';
const selectByDistance = 'SELECT * FROM distance WHERE distancia between ? and ?';
const insertDistance = 'INSERT INTO distance (distancia) values (?)';

// Queries para sensor de humedad
const selectHumedad = 'SELECT * FROM sensor_humedad';
const selectHumedadByDate = 'SELECT * FROM sensor_humedad WHERE fecha_lectura BETWEEN ? AND ?';
const insertHumedad = 'INSERT INTO sensor_humedad (humedad) VALUES (?)'; 

// Queries para fotoresistencia
const selectPorcentaje = 'SELECT * FROM fotoresistencia';
const selectPorcentajeByDate = 'SELECT * FROM fotoresistencia WHERE Fecha BETWEEN ? AND ?';
const insertPorcentaje = 'INSERT INTO fotoresistencia (Porcentaje) VALUES (?)';

// Queries para dato relacional sensacion termica

const selectTermicalSensation = 'SELECT SUM(Sensacion) FROM (SELECT Sensacion FROM termical_sensation ORDER BY id DESC LIMIT 60) AS recent_sensations;';
const insertTermicalSensation = 'INSERT INTO termical_sensation (Sensacion) VALUES (?)';

// Queries para reiniciar las bases de datos

const resetTemperature = 'TRUNCATE TABLE temps';
const resetHumidity = 'TRUNCATE TABLE sensor_humedad';
const resetDistance = 'TRUNCATE TABLE distance';
const resetLight = 'TRUNCATE TABLE fotoresistencia';
const resetPresence = 'TRUNCATE TABLE presence';
const resetTermicSens = 'TRUNCATE TABLE SensTerm';


module.exports= {
   dbHost,dbPort,dbUser,dbPass,dbName,serverPort, contextURL,api,getTemperatureSensor,
   getTemperatureSensorByDate,postTemperatureSensor,selectTemperature,selectTemperatureByDate,insertTemperature,
   getPresenceSensor,getPresenceSensorByDate,postPresenceSensor,selectPresence,selectPresenceByDate,insertPresence,
   getDistanceSensor, getByDistance, postDistanceSensor, selectDistance, selectByDistance, insertDistance, 
   getHumedadSensor, getHumedadSensorByDate, postHumedadSensor, selectHumedad, selectHumedadByDate, insertHumedad, 
   getFotoresistence, getFotoresistenceByDate, postFotoresistence, selectPorcentaje, selectPorcentajeByDate, insertPorcentaje,
   resetDistance, resetHumidity, resetLight, resetPresence, resetTemperature, resetRegisters, getTermicalSensation, postTermicalSensation,
   resetTermicSens, selectTermicalSensation, insertTermicalSensation
}