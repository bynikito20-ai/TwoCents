// Archivo de rutas para las noticias.
// Define los endpoints relacionados con la obtención de noticias desde la API de GNews.

// Importa el framework Express para crear el enrutador
const express = require('express');
// Importa el controlador de noticias que contiene la lógica para consultar la API externa
const noticiaController = require('../controllers/noticiaController');

// Crea una instancia de Router de Express para definir las rutas de noticias
const router = express.Router();

// Define la ruta GET que devuelve las noticias de actualidad al cliente
router.get('/noticias', noticiaController.obtenerNoticias);

// Exporta el enrutador para montarlo en la aplicación principal
module.exports = router;