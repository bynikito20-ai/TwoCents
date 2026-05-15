function formatearFechaMySQL(fecha) {
    const d = fecha ? new Date(fecha) : new Date();
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Evita procesar dos veces el mismo mensaje cuando hay doble emit casi simultaneo.
const mensajesProcesadosGlobal = new Set();
const huellasMensajesRecientes = new Map();

module.exports = {
    formatearFechaMySQL,
    mensajesProcesadosGlobal,
    huellasMensajesRecientes
};
