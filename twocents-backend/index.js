const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./app');
require('./config/db');
const registrarSockets = require('./sockets');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,   // ← evita desconexiones en Railway
    pingInterval: 25000,
});

registrarSockets(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
