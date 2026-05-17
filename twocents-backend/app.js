// Archivo principal de configuración de la aplicación Express.
// Define los middlewares, las políticas CORS y monta todas las rutas de la API.

// Importa el framework Express para crear la aplicación
const express = require('express');
// Importa el middleware CORS para permitir peticiones desde el frontend
const cors = require('cors');
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa las rutas de salas, mensajes y noticias
const salaRoutes = require('./routes/salaRoutes');
const mensajeRoutes = require('./routes/mensajeRoutes');
const noticiaRoutes = require('./routes/noticiaRoutes');

// Crea la instancia de la aplicación Express
const app = express();

// Configura CORS para aceptar peticiones desde la URL del frontend definida en .env o localhost por defecto
app.use(cors({
    // Origen permitido para las peticiones (dominio del frontend)
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    // Permite el envío de cookies y credenciales en las peticiones
    credentials: true
}));
// Middleware que parsea el cuerpo de las peticiones con formato JSON
app.use(express.json());

// Monta las rutas de salas bajo el prefijo /api
app.use('/api', salaRoutes);
// Monta las rutas de mensajes bajo el prefijo /api
app.use('/api', mensajeRoutes);
// Monta las rutas de noticias bajo el prefijo /api
app.use('/api', noticiaRoutes);

// Exporta la aplicación para usarla en el servidor principal (server.js)
module.exports = app;