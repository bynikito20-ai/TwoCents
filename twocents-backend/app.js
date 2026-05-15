const express = require('express');
const cors = require('cors');
require('dotenv').config();

const salaRoutes = require('./routes/salaRoutes');
const mensajeRoutes = require('./routes/mensajeRoutes');
const noticiaRoutes = require('./routes/noticiaRoutes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api', salaRoutes);
app.use('/api', mensajeRoutes);
app.use('/api', noticiaRoutes);

module.exports = app;
