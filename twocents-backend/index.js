// Archivo de entrada del servidor.
// Crea el servidor HTTP, configura Socket.IO y arranca la aplicación en el puerto indicado.

// Importa el módulo http nativo de Node para crear el servidor
const http = require('http');
// Importa la clase Server de socket.io para gestionar WebSockets
const { Server } = require('socket.io');
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa la aplicación Express ya configurada con middlewares y rutas
const app = require('./app');
// Ejecuta la conexión a la base de datos MySQL al iniciar el servidor
require('./config/db');
// Importa la función que registra todos los handlers de Socket.IO
const registrarSockets = require('./sockets');

// Crea el servidor HTTP usando la aplicación Express
const server = http.createServer(app);
// Crea la instancia de Socket.IO asociada al servidor HTTP con su configuración
const io = new Server(server, {
    // Configura CORS para las conexiones WebSocket
    cors: {
        // Origen permitido para las conexiones (dominio del frontend)
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        // Métodos HTTP permitidos para las peticiones de Socket.IO
        methods: ["GET", "POST"],
        // Permite el envío de cookies y credenciales
        credentials: true
    },
    // Tiempo máximo de espera antes de considerar un cliente desconectado (evita desconexiones en Railway)
    pingTimeout: 60000,   // ← evita desconexiones en Railway
    // Intervalo entre pings para verificar que el cliente sigue conectado
    pingInterval: 25000,
});

// Registra todos los handlers de sockets (auth, chat, typing) en la instancia de Socket.IO
registrarSockets(io);

// Define el puerto del servidor desde las variables de entorno o usa 3001 por defecto
const PORT = process.env.PORT || 3001;
// Arranca el servidor y escucha en el puerto definido
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});