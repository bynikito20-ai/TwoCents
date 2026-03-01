import io from 'socket.io-client';

// Creamos la conexión UNA SOLA VEZ
const socket = io('http://localhost:3001');

// Exportamos esta misma conexión para usarla en toda la app
export default socket;