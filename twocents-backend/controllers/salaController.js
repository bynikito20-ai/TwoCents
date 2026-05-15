const db = require('../config/db');

// ==========================================
// CREAR UNA NUEVA SALA
// ==========================================
function crearSala(req, res) {
    // Recibimos los datos que nos manda React
    const { nombre, descripcion, tipo } = req.body;

    // Ajusta "SALA" y los nombres de las columnas a como las tengas en tu base de datos MySQL
    const sql = "INSERT INTO SALA (nombre, descripcion, tipo) VALUES (?, ?, ?)";

    db.query(sql, [nombre, descripcion, tipo], (err, result) => {
        if (err) {
            console.error("❌ Error al crear la sala:", err);
            return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
        }

        // result.insertId contiene el ID autoincremental que acaba de generar MySQL
        console.log("✅ Sala creada con éxito, ID:", result.insertId);

        // Le devolvemos a React un "OK" y el nuevo ID
        res.json({
            success: true,
            id_sala: result.insertId,
            nombre: nombre,
            descripcion: descripcion,
            tipo: tipo
        });
    });
}

// ==========================================
// OBTENER LAS SALAS POR CATEGORÍA
// ==========================================
function obtenerSalasPorTipo(req, res) {
    // Cogemos el tipo de la URL (ej: 'deportes', 'diversion')
    const tipoSala = req.params.tipo;

    // Buscamos en la base de datos solo las salas de ese tipo
    const sql = "SELECT * FROM SALA WHERE tipo = ?";

    db.query(sql, [tipoSala], (err, resultados) => {
        if (err) {
            console.error("❌ Error al cargar las salas:", err);
            return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }

        // Le enviamos las salas encontradas a React
        res.json(resultados);
    });
}

// ==========================================
// OBTENER UNA SALA POR ID
// ==========================================
function obtenerSalaPorId(req, res) {
    const idSala = req.params.idSala;
    const sql = "SELECT id_sala, nombre, descripcion, tipo FROM SALA WHERE id_sala = ? LIMIT 1";

    db.query(sql, [idSala], (err, resultados) => {
        if (err) {
            console.error("❌ Error al cargar sala por ID:", err);
            return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }

        if (!resultados || resultados.length === 0) {
            return res.status(404).json({ success: false, message: 'Sala no encontrada' });
        }

        res.json(resultados[0]);
    });
}

module.exports = {
    crearSala,
    obtenerSalasPorTipo,
    obtenerSalaPorId
};
