const db = require('../config/db');
const {
    formatearFechaMySQL,
    mensajesProcesadosGlobal,
    huellasMensajesRecientes
} = require('../utils/helpers');

// ==========================================
// HANDLERS DEL CHAT (unirse, salir, enviar, desconexión)
// ==========================================
function chatHandler(io, socket, mensajesProcesados) {
    // ------------------------------------------
    // 4. UNIRSE A UNA SALA DE CHAT
    // ------------------------------------------
    socket.on('unirse_chat', (data) => {
        // data contiene { id_sala, id_usuario, nombre_usuario }
        const idSala = String(data.id_sala || data); // Siempre string para consistencia

        if (socket.data?.salaActual && socket.data.salaActual !== idSala) {
            const salaAnterior = socket.data.salaActual;
            socket.leave(salaAnterior);
            // Emitir tras el leave (el socket ya salió)
            setImmediate(() => {
                const countAnterior = io.sockets.adapter.rooms.get(salaAnterior)?.size || 0;
                io.to(salaAnterior).emit('usuarios_sala', { id_sala: salaAnterior, total: countAnterior });
            });
        }
        socket.data = socket.data || {};
        socket.data.salaActual = idSala;

        socket.join(idSala);
        console.log(`💬 ${data.nombre_usuario || 'Usuario'} se unió a la sala: ${idSala}`);

        // Emitir conteo actualizado a todos en la sala
        setImmediate(() => {
            const count = io.sockets.adapter.rooms.get(idSala)?.size || 1;
            io.to(idSala).emit('usuarios_sala', { id_sala: idSala, total: count });
        });
    });

    socket.on('salir_chat', (data) => {
        const idSala = String(data?.id_sala);
        if (!idSala || idSala === 'undefined') {
            return;
        }

        socket.leave(idSala);
        if (socket.data?.salaActual === idSala) {
            socket.data.salaActual = null;
        }

        // Emitir conteo actualizado tras salir
        setImmediate(() => {
            const count = io.sockets.adapter.rooms.get(idSala)?.size || 0;
            io.to(idSala).emit('usuarios_sala', { id_sala: idSala, total: count });
        });
    });

    // ------------------------------------------
    // 5. ENVIAR Y RECIBIR MENSAJES EN TIEMPO REAL
    // ------------------------------------------
    socket.on('enviar_mensaje', (data) => {
        // Estos son los datos que React nos manda cuando alguien pulsa "Enviar"
        const { client_msg_id, id_sala, id_usuario, contenido, nombre_usuario, hora_envio } = data;

        const contenidoNormalizado = (contenido || '').trim();
        if (!contenidoNormalizado) {
            return;
        }

        // Deduplicacion global por id de mensaje del cliente (entre sockets tambien).
        if (client_msg_id && mensajesProcesadosGlobal.has(client_msg_id)) {
            return;
        }
        if (client_msg_id) {
            mensajesProcesadosGlobal.add(client_msg_id);
            setTimeout(() => mensajesProcesadosGlobal.delete(client_msg_id), 30000);
        }

        // Deduplicacion por huella semantica para dobles emits casi simultaneos.
        const huellaMensaje = `${id_sala}|${id_usuario}|${contenidoNormalizado}`;
        const ahora = Date.now();
        const ultimoEnvio = huellasMensajesRecientes.get(huellaMensaje);
        if (ultimoEnvio && ahora - ultimoEnvio < 1500) {
            return;
        }
        huellasMensajesRecientes.set(huellaMensaje, ahora);
        setTimeout(() => {
            if (huellasMensajesRecientes.get(huellaMensaje) === ahora) {
                huellasMensajesRecientes.delete(huellaMensaje);
            }
        }, 10000);

        if (client_msg_id && mensajesProcesados.has(client_msg_id)) {
            return;
        }
        if (client_msg_id) {
            mensajesProcesados.add(client_msg_id);
            setTimeout(() => mensajesProcesados.delete(client_msg_id), 30000);
        }

        // Evita duplicados inmediatos del mismo mensaje (doble submit o doble socket emit)
        const sqlDuplicado = `
            SELECT id_mensaje
            FROM MENSAJE
            WHERE id_sala = ? AND id_usuario = ? AND contenido = ?
              AND hora_envio >= DATE_SUB(NOW(), INTERVAL 2 SECOND)
            ORDER BY id_mensaje DESC
            LIMIT 1
        `;

        db.query(sqlDuplicado, [id_sala, id_usuario, contenidoNormalizado], (dupErr, duplicados) => {
            if (dupErr) {
                console.error("❌ Error comprobando duplicado:", dupErr);
                return;
            }

            if (Array.isArray(duplicados) && duplicados.length > 0) {
                return;
            }

            // 1. Guardamos el mensaje en tu tabla 'mensaje' de MySQL
            const sql = "INSERT INTO MENSAJE (id_sala, id_usuario, contenido, hora_envio) VALUES (?, ?, ?, ?)";

            db.query(sql, [id_sala, id_usuario, contenidoNormalizado, formatearFechaMySQL(hora_envio)], (err, result) => {
                if (err) {
                    console.error("❌ Error al guardar mensaje:", err);
                    return;
                }

                console.log(`✅ Mensaje guardado en sala ${id_sala}`);

                // 2. Si se guardó bien, emitimos el evento 'recibir_mensaje' incluyendo el id del mensaje
                const mensajeCompleto = {
                    id_mensaje: result.insertId,
                    id_sala,
                    id_usuario,
                    contenido: contenidoNormalizado,
                    nombre_usuario,
                    hora_envio: hora_envio || new Date().toISOString()
                };

                // Evento global para notificaciones fuera del chat
                io.emit('mensaje_nuevo_notificacion', {
                    id_sala,
                    id_usuario,
                    hora_envio: mensajeCompleto.hora_envio
                });

                // io.to(id_sala) asegura que el mensaje SOLO le llegue a los
                // usuarios que están dentro de esta sala, y no a toda la web.
                io.to(id_sala).emit('recibir_mensaje', mensajeCompleto);
            });
        });
    });

    // ------------------------------------------
    // 3. DESCONEXIÓN
    // ------------------------------------------
    socket.on('disconnect', () => {
        const salaActual = socket.data?.salaActual;
        if (salaActual) {
            // Emitir conteo actualizado a los que quedan en la sala
            setImmediate(() => {
                const count = io.sockets.adapter.rooms.get(String(salaActual))?.size || 0;
                io.to(String(salaActual)).emit('usuarios_sala', { id_sala: salaActual, total: count });
            });
        }
        console.log('🔌 Cliente desconectado');
    });
}

module.exports = chatHandler;
