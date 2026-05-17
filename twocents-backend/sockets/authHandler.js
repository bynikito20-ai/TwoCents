// Archivo que gestiona la autenticación de usuarios mediante WebSockets (Socket.IO).
// Contiene los handlers para el registro y el login de usuarios.

// Importa bcrypt para el cifrado y verificación de contraseñas
const bcrypt = require('bcrypt');
// Importa la conexión al pool de MySQL configurada en db.js
const db = require('../config/db');

// ==========================================
// HANDLERS DE AUTENTICACIÓN (registro y login)
// ==========================================
// Función principal que recibe la instancia de Socket.IO y el socket del cliente conectado
function authHandler(io, socket) {
    // ------------------------------------------
    // 1. ESCUCHAR EVENTO DE REGISTRO
    // ------------------------------------------
    // Escucha cuando un cliente emite el evento 'registrar_usuario' con sus datos
    socket.on('registrar_usuario', async (data) => {
        // Desestructura los datos recibidos del formulario de registro
        const { usuario, email, password } = data;

        try {
            // Genera un salt aleatorio con 10 rondas de complejidad para el hash
            const salt = await bcrypt.genSalt(10);
            // Genera el hash de la contraseña combinándola con el salt
            const hashedPass = await bcrypt.hash(password, salt);

            // Consulta SQL para insertar el nuevo usuario con la contraseña cifrada
            const sql = "INSERT INTO USUARIO (usuario, email, constrasenia_hash) VALUES (?, ?, ?)";

            // Ejecuta la inserción en la base de datos
            db.query(sql, [usuario, email, hashedPass], (err, result) => {
                // Si hay error (usuario o email duplicados), notifica al cliente
                if (err) {
                    console.error("❌ Error al registrar:", err);
                    socket.emit('registro_resultado', { success: false, message: 'Error: El usuario o email ya existen.' });
                } else {
                    // Si la inserción es exitosa, notifica al cliente con un mensaje de éxito
                    console.log("✅ Usuario registrado con éxito:", usuario);
                    socket.emit('registro_resultado', { success: true, message: '¡Usuario registrado con éxito!' });
                }
            });
        } catch (error) {
            // Captura cualquier error inesperado durante el proceso de registro
            console.error("❌ Error interno en registro:", error);
            socket.emit('registro_resultado', { success: false, message: 'Error interno del servidor.' });
        }
    });

    // ------------------------------------------
    // 2. ESCUCHAR EVENTO DE LOGIN
    // ------------------------------------------
    // Escucha cuando un cliente emite el evento 'login_usuario' con sus credenciales
    socket.on('login_usuario', async (data) => {
        // Desestructura el nombre de usuario y la contraseña recibidos
        const { usuario, password } = data;

        try {
            // Consulta SQL para buscar al usuario por su nombre en la base de datos
            const sql = "SELECT * FROM USUARIO WHERE usuario = ?";

            // Ejecuta la consulta para verificar si el usuario existe
            db.query(sql, [usuario], async (err, resultados) => {
                // Si hay error en la consulta, notifica al cliente
                if (err) {
                    console.error("❌ Error en la consulta de login:", err);
                    socket.emit('login_resultado', { success: false, message: 'Error en el servidor.' });
                    return;
                }

                // Si no se encuentra ningún usuario con ese nombre, notifica al cliente
                if (resultados.length === 0) {
                    console.log("⚠️ Intento de login: Usuario no encontrado ->", usuario);
                    socket.emit('login_resultado', { success: false, message: 'El usuario no existe.' });
                    return;
                }

                // Guarda el primer resultado (el usuario encontrado)
                const usuarioEncontrado = resultados[0];
                // Compara la contraseña introducida con el hash almacenado en la base de datos
                const contraseniaValida = await bcrypt.compare(password, usuarioEncontrado.constrasenia_hash);

                // Si la contraseña coincide, envía los datos del usuario al cliente
                if (contraseniaValida) {
                    console.log("✅ ¡Login exitoso para:", usuario);
                    socket.emit('login_resultado', {
                        success: true,
                        usuario: {
                            id_usuario: usuarioEncontrado.id_usuario,
                            nombre: usuarioEncontrado.usuario,
                            email: usuarioEncontrado.email
                        }
                    });
                } else {
                    // Si la contraseña no coincide, notifica al cliente
                    console.log("❌ Contraseña incorrecta para:", usuario);
                    socket.emit('login_resultado', { success: false, message: 'Contraseña incorrecta.' });
                }
            });
        } catch (error) {
            // Captura cualquier error inesperado durante el proceso de login
            console.error("❌ Error interno en login:", error);
            socket.emit('login_resultado', { success: false, message: 'Error interno del servidor.' });
        }
    });
}

// Exporta la función para registrar los handlers de autenticación en el servidor de sockets
module.exports = authHandler;