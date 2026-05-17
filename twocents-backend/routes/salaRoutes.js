// Archivo de rutas para las salas de chat.
// Define los endpoints para crear salas, obtenerlas por tipo y buscar una sala por su id.

// Importa el framework Express para crear el enrutador
const express = require('express');
// Importa el controlador de salas que contiene la lógica de negocio
const salaController = require('../controllers/salaController');

// Crea una instancia de Router de Express para definir las rutas de salas
const router = express.Router();

// Define la ruta POST para crear una nueva sala de chat
router.post('/salas', salaController.crearSala);
// Define la ruta GET para obtener todas las salas filtradas por tipo/categoría
router.get('/salas/:tipo', salaController.obtenerSalasPorTipo);
// Define la ruta GET para obtener una sala específica por su id
router.get('/sala/:idSala', salaController.obtenerSalaPorId);

// Exporta el enrutador para montarlo en la aplicación principal
module.exports = router;