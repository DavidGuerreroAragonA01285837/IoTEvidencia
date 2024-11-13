/**
 * Instrucciones:
 * 
 * 1. Por cada sensor que tenga tu tabla de base de datos corresponsientes, deberás crear 
 *    un archivo similar al archivo /RestControllers/sensorTemperatura.js
 * 2. Registra en el router todos los métodos disponibles en tu controlador con una URL que haga mencion a dicha acción
 * 
 * 
 */
const constants = require("./constants")
const express = require('express');
const temperaturaController = require('./RestControllers/sensorTemperatura.js'); 
const PresenceController = require('./RestControllers/sensorPresencia.js');
const DistanceController = require('./RestControllers/sensorDistancia.js');
const HumedadController = require('./RestControllers/sensorHumedad.js');
const porcentajeController = require('./RestControllers/sensorFotoresistencia');
const resetController = require ('./RestControllers/Reset.js')
const TermicSensController = require ('./RestControllers/SensacionTermica.js');
const router = express.Router();

router.get("/",function(req,res){
    res.send('<html><head><title>API IoT</title></head><body><h1>Hola mundo!</h1></body></html>');
});

/**
 * URL's que debes configurar en tu server para incluir tus endpoints que reciben peticiones para cada 
 * sensor.
 * 
 * Hay 3 métodos actualmente, 1 get HTTP y 2 post HTTP. En todos, el primer argumento es una url (creada de manera parametrizada con constantes)
 * El segundo método es la función js que responderá a las peticiones de dicha URL. Estas están en el archivo sensorTemperatura.js
 * 
 * Para otros sensores, puedes agregar otros archivos y configurar sus url's.
 * 
 */
router.get(constants.contextURL + constants.api + constants.getTemperatureSensor, temperaturaController.getLogTemperatura);
router.post(constants.contextURL + constants.api + constants.getTemperatureSensorByDate, temperaturaController.getLogByDateBetween);
router.post(constants.contextURL + constants.api + constants.postTemperatureSensor,temperaturaController.insertLogTemperatura);
router.get(constants.contextURL + constants.api + constants.getPresenceSensor, PresenceController.getLogPresence);
router.post(constants.contextURL + constants.api + constants.getPresenceSensorByDate, PresenceController.getLogByDateBetweenPresence);
router.post(constants.contextURL + constants.api + constants.postPresenceSensor,PresenceController.insertLogPresence);
router.get(constants.contextURL + constants.api + constants.getDistanceSensor, DistanceController.getLogDistance);
router.post(constants.contextURL + constants.api + constants.getByDistance, DistanceController.getLogByDistance);
router.post(constants.contextURL + constants.api + constants.postDistanceSensor, DistanceController.insertLogDistance);
router.get(constants.contextURL + constants.api + constants.getHumedadSensor, HumedadController.getLogHumedad);
router.post(constants.contextURL + constants.api + constants.getHumedadSensorByDate, HumedadController.getLogHumedadByDate);
router.post(constants.contextURL + constants.api + constants.postHumedadSensor, HumedadController.insertLogHumedad);
router.get(constants.contextURL + constants.api + constants.getFotoresistence, porcentajeController.getLogPorcentaje);
router.post(constants.contextURL + constants.api + constants.getFotoresistenceByDate, porcentajeController.getLogPorcentajeByDate);
router.post(constants.contextURL + constants.api + constants.postFotoresistence, porcentajeController.insertLogPorcentaje);
router.get(constants.contextURL + constants.api + constants.getTermicalSensation, TermicSensController.getSensTerm);
router.post(constants.contextURL + constants.api + constants.postTermicalSensation, TermicSensController.insertTermicalSensation);
router.delete(constants.contextURL + constants.api + constants.resetRegisters, resetController.resetAll);

//le decimos a Node que queremos hacer uso de nuestro router en otros archivos (como por ejemplo, app.js)
module.exports = router;