// Archivo central que registra todos los handlers de Socket.IO.
// Actúa como punto de entrada para conectar los módulos de autenticación, chat y escritura en tiempo real.

// Importa el handler de autenticación (registro y login)
const authHandler = require('./authHandler');
// Importa el handler del chat (unirse a salas, enviar mensajes, desconexión)
const chatHandler = require('./chatHandler');
// Importa el handler de escritura (indicador de "usuario está escribiendo...")
const typingHandler = require('./typingHandler');

// ==========================================
// REGISTRO DE TODOS LOS HANDLERS DE SOCKET.IO
// ==========================================
// Función que recibe la instancia de Socket.IO y escucha nuevas conexiones
function registrarSockets(io) {
    // Escucha cada vez que un nuevo cliente se conecta al servidor de WebSockets
    io.on('connection', (socket) => {
        // Crea un Set local por socket para controlar la deduplicación de mensajes
        const mensajesProcesados = new Set();
        // Registra en consola el id del nuevo cliente conectado
        console.log('👤 Nuevo cliente conectado:', socket.id);

        // Registra los eventos de autenticación (registro y login) para este socket
        authHandler(io, socket);
        // Registra los eventos del chat (unirse, salir, enviar mensajes, desconexión) para este socket
        chatHandler(io, socket, mensajesProcesados);
        // Registra los eventos de escritura en tiempo real para este socket
        typingHandler(io, socket);
    });
}

// Exporta la función para inicializarla desde el servidor principal
module.exports = registrarSockets;