// Archivo de utilidades compartidas por el servidor.
// Contiene funciones auxiliares y estructuras de datos para la deduplicación de mensajes.

// Función que convierte una fecha al formato compatible con MySQL (YYYY-MM-DD HH:MM:SS)
function formatearFechaMySQL(fecha) {
    // Si se recibe una fecha la usa, si no crea una nueva con la fecha actual
    const d = fecha ? new Date(fecha) : new Date();
    // Convierte a ISO string, recorta los milisegundos y reemplaza la 'T' por un espacio
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Evita procesar dos veces el mismo mensaje cuando hay doble emit casi simultaneo.
// Set global que almacena los ids de mensajes ya procesados entre todos los sockets
const mensajesProcesadosGlobal = new Set();
// Map que almacena huellas de mensajes recientes (combinación sala+usuario+contenido) con su timestamp
const huellasMensajesRecientes = new Map();

// Exporta las utilidades para usarlas en los handlers del chat
module.exports = {
    formatearFechaMySQL,
    mensajesProcesadosGlobal,
    huellasMensajesRecientes
};