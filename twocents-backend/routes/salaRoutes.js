const express = require('express');
const salaController = require('../controllers/salaController');

const router = express.Router();

router.post('/salas', salaController.crearSala);
router.get('/salas/:tipo', salaController.obtenerSalasPorTipo);
router.get('/sala/:idSala', salaController.obtenerSalaPorId);

module.exports = router;
