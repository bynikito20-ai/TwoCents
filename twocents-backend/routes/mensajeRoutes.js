// Archivo de rutas para los mensajes del chat.
// Define los endpoints relacionados con la obtención de mensajes de una sala.

// Importa el framework Express para crear el enrutador
const express = require('express');
// Importa el controlador de mensajes que contiene la lógica de negocio
const mensajeController = require('../controllers/mensajeController');

// Crea una instancia de Router de Express para definir las rutas de mensajes
const router = express.Router();

// Define la ruta GET que recibe un id de sala y devuelve todos sus mensajes
router.get('/mensajes/:idSala', mensajeController.obtenerMensajes);

// Exporta el enrutador para montarlo en la aplicación principal
module.exports = router;