const bcrypt = require('bcrypt');
const db = require('../config/db');

// ==========================================
// HANDLERS DE AUTENTICACIÓN (registro y login)
// ==========================================
function authHandler(io, socket) {
    // ------------------------------------------
    // 1. ESCUCHAR EVENTO DE REGISTRO
    // ------------------------------------------
    socket.on('registrar_usuario', async (data) => {
        const { usuario, email, password } = data;

        try {
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
            const sql = "SELECT * FROM USUARIO WHERE usuario = ?";

            db.query(sql, [usuario], async (err, resultados) => {
                if (err) {
                    console.error("❌ Error en la consulta de login:", err);
                    socket.emit('login_resultado', { success: false, message: 'Error en el servidor.' });
                    return;
                }

                if (resultados.length === 0) {
                    console.log("⚠️ Intento de login: Usuario no encontrado ->", usuario);
                    socket.emit('login_resultado', { success: false, message: 'El usuario no existe.' });
                    return;
                }

                const usuarioEncontrado = resultados[0];
                const contraseniaValida = await bcrypt.compare(password, usuarioEncontrado.constrasenia_hash);

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
                    console.log("❌ Contraseña incorrecta para:", usuario);
                    socket.emit('login_resultado', { success: false, message: 'Contraseña incorrecta.' });
                }
            });
        } catch (error) {
            console.error("❌ Error interno en login:", error);
            socket.emit('login_resultado', { success: false, message: 'Error interno del servidor.' });
        }
    });
}

module.exports = authHandler;
