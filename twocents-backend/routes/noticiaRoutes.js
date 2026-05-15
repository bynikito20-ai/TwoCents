const express = require('express');
const noticiaController = require('../controllers/noticiaController');

const router = express.Router();

router.get('/noticias', noticiaController.obtenerNoticias);

module.exports = router;
