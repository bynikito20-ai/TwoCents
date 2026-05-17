// Importa la conexión al pool de MySQL configurada en db.js
const db = require('../config/db');

// ==========================================
// OBTENER EL HISTORIAL DE MENSAJES DE UNA SALA
// ==========================================
// Función que maneja la petición para obtener todos los mensajes de una sala de chat
function obtenerMensajes(req, res) {
    // Extrae el identificador de la sala desde los parámetros de la URL
    const idSala = req.params.idSala;

    // Consulta SQL que obtiene los mensajes junto con el nombre del usuario que los envió
    const sql = `
        SELECT
            m.id_mensaje,
            m.id_usuario,
            m.id_sala,
            m.contenido,
            m.hora_envio,
            u.usuario as nombre_usuario
        FROM MENSAJE m
        LEFT JOIN USUARIO u ON m.id_usuario = u.id_usuario
        WHERE m.id_sala = ?
        ORDER BY m.id_mensaje ASC
    `;

    // Ejecuta la consulta pasando el id de la sala como parámetro para prevenir inyección SQL
    db.query(sql, [idSala], (err, resultados) => {
        // Si ocurre un error en la consulta, lo registra y devuelve un error 500
        if (err) {
            console.error("❌ Error al cargar mensajes:", err);
            console.error("SQL usado:", sql);
            return res.status(500).json({ success: false, message: 'Error al cargar mensajes', error: err.message });
        }

        // Registra en consola cuántos mensajes se encontraron para esa sala
        // Si no hay mensajes, devolvemos un array vacío
        console.log(`✅ Mensajes cargados para sala ${idSala}:`, resultados.length);
        // Responde con los resultados o un array vacío si no hay mensajes
        res.json(resultados || []);
    });
}

// Exporta la función para que pueda usarse como controlador en las rutas
module.exports = {
    obtenerMensajes
};