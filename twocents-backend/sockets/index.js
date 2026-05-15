const authHandler = require('./authHandler');
const chatHandler = require('./chatHandler');
const typingHandler = require('./typingHandler');

// ==========================================
// REGISTRO DE TODOS LOS HANDLERS DE SOCKET.IO
// ==========================================
function registrarSockets(io) {
    io.on('connection', (socket) => {
        const mensajesProcesados = new Set();
        console.log('👤 Nuevo cliente conectado:', socket.id);

        authHandler(io, socket);
        chatHandler(io, socket, mensajesProcesados);
        typingHandler(io, socket);
    });
}

module.exports = registrarSockets;
