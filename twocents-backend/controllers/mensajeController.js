const db = require('../config/db');

// ==========================================
// OBTENER EL HISTORIAL DE MENSAJES DE UNA SALA
// ==========================================
function obtenerMensajes(req, res) {
    const idSala = req.params.idSala;

    // Consultar todos los mensajes de una sala específica
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

    db.query(sql, [idSala], (err, resultados) => {
        if (err) {
            console.error("❌ Error al cargar mensajes:", err);
            console.error("SQL usado:", sql);
            return res.status(500).json({ success: false, message: 'Error al cargar mensajes', error: err.message });
        }

        // Si no hay mensajes, devolvemos un array vacío
        console.log(`✅ Mensajes cargados para sala ${idSala}:`, resultados.length);
        res.json(resultados || []);
    });
}

module.exports = {
    obtenerMensajes
};
