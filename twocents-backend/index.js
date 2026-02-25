const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // La URL donde corre tu React
        methods: ["GET", "POST"]
    }
});

// ==========================================
// CONFIGURACIÓN DE LA CONEXIÓN A MYSQL
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la DB:', err);
        return;
    }
    console.log('✅ Conectado a MySQL: twocents_db');
});

// ==========================================
// LÓGICA DE SOCKETS
// ==========================================
io.on('connection', (socket) => {
    console.log('👤 Nuevo cliente conectado:', socket.id);

    // ------------------------------------------
    // 1. ESCUCHAR EVENTO DE REGISTRO
    // ------------------------------------------
    socket.on('registrar_usuario', async (data) => {
        const { usuario, email, password } = data;

        try {
            // Encriptamos la contraseña como dice tu modelo (Bcrypt)
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);

            const sql = "INSERT INTO USUARIO (usuario, email, constrasenia_hash) VALUES (?, ?, ?)";
            
            db.query(sql, [usuario, email, hashedPass], (err, result) => {
                if (err) {
                    console.error("❌ Error al registrar:", err);
                    socket.emit('registro_resultado', { success: false, message: 'Error: El usuario o email ya existen.' });
                } else {
                    console.log("✅ Usuario registrado con éxito:", usuario);
                    socket.emit('registro_resultado', { success: true, message: '¡Usuario registrado con éxito!' });
                }
            });
        } catch (error) {
            console.error("❌ Error interno en registro:", error);
            socket.emit('registro_resultado', { success: false, message: 'Error interno del servidor.' });
        }
    });

    // ------------------------------------------
    // 2. ESCUCHAR EVENTO DE LOGIN
    // ------------------------------------------
    socket.on('login_usuario', async (data) => {
        const { usuario, password } = data;

        try {
            // Buscamos al usuario en la base de datos solo por su nombre
            const sql = "SELECT * FROM USUARIO WHERE usuario = ?";
            
            db.query(sql, [usuario], async (err, resultados) => {
                if (err) {
                    console.error("❌ Error en la consulta de login:", err);
                    socket.emit('login_resultado', { success: false, message: 'Error en el servidor.' });
                    return;
                }

                // Si resultados.length es 0, ese usuario no existe en la base de datos
                if (resultados.length === 0) {
                    console.log("⚠️ Intento de login: Usuario no encontrado ->", usuario);
                    socket.emit('login_resultado', { success: false, message: 'El usuario no existe.' });
                    return;
                }

                const usuarioEncontrado = resultados[0];

                // Comparamos la contraseña que escribió con el hash guardado en MySQL
                const contraseniaValida = await bcrypt.compare(password, usuarioEncontrado.constrasenia_hash);

                if (contraseniaValida) {
                    console.log("✅ ¡Login exitoso para:", usuario);
                    // Le devolvemos al frontend los datos (pero NUNCA la contraseña por seguridad)
                    socket.emit('login_resultado', { 
                        success: true, 
                        usuario: { 
                            nombre: usuarioEncontrado.usuario, 
                            email: usuarioEncontrado.email 
                        } 
                    });
                } else {
                    console.log("❌ Contraseña incorrecta para:", usuario);
                    socket.emit('login_resultado', { success: false, message: 'Contraseña incorrecta.' });
                }
            });
        } catch (error) {
            console.error("❌ Error interno en login:", error);
            socket.emit('login_resultado', { success: false, message: 'Error interno del servidor.' });
        }
    });

    // ------------------------------------------
    // 3. DESCONEXIÓN
    // ------------------------------------------
    socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});