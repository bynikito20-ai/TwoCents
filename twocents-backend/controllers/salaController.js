// Importa la conexión al pool de MySQL configurada en db.js
const db = require('../config/db');

// ==========================================
// CREAR UNA NUEVA SALA
// ==========================================
// Función que maneja la petición para crear una nueva sala de chat
function crearSala(req, res) {
    // Recibimos los datos que nos manda React (nombre, descripción y tipo de sala)
    const { nombre, descripcion, tipo } = req.body;

    // Consulta SQL para insertar una nueva sala en la tabla SALA
    // Ajusta "SALA" y los nombres de las columnas a como las tengas en tu base de datos MySQL
    const sql = "INSERT INTO SALA (nombre, descripcion, tipo) VALUES (?, ?, ?)";

    // Ejecuta la inserción pasando los valores como parámetros para evitar inyección SQL
    db.query(sql, [nombre, descripcion, tipo], (err, result) => {
        // Si falla la inserción, registra el error y devuelve un 500
        if (err) {
            console.error("❌ Error al crear la sala:", err);
            return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
        }

        // result.insertId contiene el ID autoincremental que acaba de generar MySQL
        console.log("✅ Sala creada con éxito, ID:", result.insertId);

        // Le devolvemos a React un "OK" y el nuevo ID junto con los datos de la sala creada
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
// Función que devuelve todas las salas filtradas por su tipo/categoría
function obtenerSalasPorTipo(req, res) {
    // Cogemos el tipo de la URL (ej: 'deportes', 'diversion')
    const tipoSala = req.params.tipo;

    // Consulta SQL que filtra las salas por el tipo recibido
    // Buscamos en la base de datos solo las salas de ese tipo
    const sql = "SELECT * FROM SALA WHERE tipo = ?";

    // Ejecuta la consulta con el tipo como parámetro
    db.query(sql, [tipoSala], (err, resultados) => {
        // Si hay error en la consulta, lo registra y devuelve un 500
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
// Función que busca y devuelve una sala específica por su identificador
function obtenerSalaPorId(req, res) {
    // Extrae el id de la sala desde los parámetros de la URL
    const idSala = req.params.idSala;
    // Consulta SQL que busca una sola sala por su id, limitando a 1 resultado
    const sql = "SELECT id_sala, nombre, descripcion, tipo FROM SALA WHERE id_sala = ? LIMIT 1";

    // Ejecuta la consulta con el id como parámetro
    db.query(sql, [idSala], (err, resultados) => {
        // Si hay error en la consulta, lo registra y devuelve un 500
        if (err) {
            console.error("❌ Error al cargar sala por ID:", err);
            return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }

        // Si no se encuentra ninguna sala con ese id, devuelve un 404
        if (!resultados || resultados.length === 0) {
            return res.status(404).json({ success: false, message: 'Sala no encontrada' });
        }

        // Devuelve el primer (y único) resultado encontrado
        res.json(resultados[0]);
    });
}

// Exporta las tres funciones para usarlas como controladores en las rutas
module.exports = {
    crearSala,
    obtenerSalasPorTipo,
    obtenerSalaPorId
};