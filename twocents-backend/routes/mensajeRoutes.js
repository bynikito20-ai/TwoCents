const express = require('express');
const mensajeController = require('../controllers/mensajeController');

const router = express.Router();

router.get('/mensajes/:idSala', mensajeController.obtenerMensajes);

module.exports = router;
