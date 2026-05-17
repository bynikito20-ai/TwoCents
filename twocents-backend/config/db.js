// Importa el módulo mysql2 para interactuar con bases de datos MySQL
const mysql = require('mysql2');
// Carga las variables de entorno desde el archivo .env en process.env
require('dotenv').config();

// ==========================================
// CONFIGURACIÓN DE LA CONEXIÓN A MYSQL
// ==========================================
// Crea un pool de conexiones a MySQL usando las variables de entorno
const db = mysql.createPool({
    // Dirección del servidor de base de datos
    host: process.env.DB_HOST,
    // Puerto en el que escucha MySQL
    port: process.env.DB_PORT,
    // Usuario para autenticarse en la base de datos
    user: process.env.DB_USER,
    // Contraseña del usuario
    password: process.env.DB_PASS,
    // Nombre de la base de datos a conectar
    database: process.env.DB_NAME,
    // Permite encolar peticiones cuando no hay conexiones libres
    waitForConnections: true,
    // Máximo de conexiones simultáneas en el pool
    connectionLimit: 10,
    // Sin límite en la cola de espera (0 = ilimitado)
    queueLimit: 0
});

// Solicita una conexión del pool para verificar que la base de datos es accesible
db.getConnection((err, connection) => {
    // Si hay error al conectar, lo muestra por consola y sale
    if (err) {
        console.error('❌ Error conectando a la DB:', err);
        return;
    }
    // Conexión exitosa, muestra mensaje de confirmación
    console.log('✅ Conectado a MySQL: twocents_db');
    // Libera la conexión de vuelta al pool para que pueda reutilizarse
    connection.release();
});

// Exporta el pool para que otros módulos puedan hacer consultas
module.exports = db;