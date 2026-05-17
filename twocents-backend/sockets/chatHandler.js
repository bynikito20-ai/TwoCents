// Archivo que gestiona toda la lógica del chat en tiempo real mediante WebSockets (Socket.IO).
// Incluye los handlers para unirse a salas, salir, enviar mensajes y manejar desconexiones.

// Importa la conexión al pool de MySQL configurada en db.js
const db = require('../config/db');
// Importa funciones auxiliares: formateo de fechas y estructuras para deduplicación de mensajes
const {
    formatearFechaMySQL,
    mensajesProcesadosGlobal,
    huellasMensajesRecientes
} = require('../utils/helpers');

// ==========================================
// HANDLERS DEL CHAT (unirse, salir, enviar, desconexión)
// ==========================================
// Función principal que recibe la instancia de Socket.IO, el socket del cliente y un Set local para deduplicación
function chatHandler(io, socket, mensajesProcesados) {
    // ------------------------------------------
    // 4. UNIRSE A UNA SALA DE CHAT
    // ------------------------------------------
    // Escucha cuando un cliente quiere unirse a una sala
    socket.on('unirse_chat', (data) => {
        // data contiene { id_sala, id_usuario, nombre_usuario }
        // Convierte el id de sala a string para mantener consistencia
        const idSala = String(data.id_sala || data); // Siempre string para consistencia

        // Si el socket ya estaba en otra sala, lo saca primero de la anterior
        if (socket.data?.salaActual && socket.data.salaActual !== idSala) {
            const salaAnterior = socket.data.salaActual;
            // Abandona la sala anterior
            socket.leave(salaAnterior);
            // Emitir tras el leave (el socket ya salió)
            // Usa setImmediate para esperar a que el leave se procese antes de emitir el conteo
            setImmediate(() => {
                // Obtiene el número de usuarios que quedan en la sala anterior
                const countAnterior = io.sockets.adapter.rooms.get(salaAnterior)?.size || 0;
                // Notifica a los usuarios restantes de la sala anterior el nuevo conteo
                io.to(salaAnterior).emit('usuarios_sala', { id_sala: salaAnterior, total: countAnterior });
            });
        }
        // Inicializa el objeto data del socket si no existe
        socket.data = socket.data || {};
        // Guarda la sala actual en la que se encuentra el socket
        socket.data.salaActual = idSala;

        // Une al socket a la nueva sala
        socket.join(idSala);
        console.log(`💬 ${data.nombre_usuario || 'Usuario'} se unió a la sala: ${idSala}`);

        // Emitir conteo actualizado a todos en la sala
        setImmediate(() => {
            // Obtiene cuántos usuarios hay ahora en la sala
            const count = io.sockets.adapter.rooms.get(idSala)?.size || 1;
            // Notifica a todos en la sala el número actualizado de usuarios
            io.to(idSala).emit('usuarios_sala', { id_sala: idSala, total: count });
        });
    });

    // Escucha cuando un cliente quiere salir de una sala
    socket.on('salir_chat', (data) => {
        // Obtiene el id de la sala de la que quiere salir
        const idSala = String(data?.id_sala);
        // Si no hay id válido, no hace nada
        if (!idSala || idSala === 'undefined') {
            return;
        }

        // Saca al socket de la sala
        socket.leave(idSala);
        // Limpia la referencia a la sala actual si coincide
        if (socket.data?.salaActual === idSala) {
            socket.data.salaActual = null;
        }

        // Emitir conteo actualizado tras salir
        setImmediate(() => {
            // Obtiene cuántos usuarios quedan en la sala
            const count = io.sockets.adapter.rooms.get(idSala)?.size || 0;
            // Notifica a los usuarios restantes el nuevo conteo
            io.to(idSala).emit('usuarios_sala', { id_sala: idSala, total: count });
        });
    });

    // ------------------------------------------
    // 5. ENVIAR Y RECIBIR MENSAJES EN TIEMPO REAL
    // ------------------------------------------
    // Escucha cuando un cliente envía un nuevo mensaje
    socket.on('enviar_mensaje', (data) => {
        // Estos son los datos que React nos manda cuando alguien pulsa "Enviar"
        const { client_msg_id, id_sala, id_usuario, contenido, nombre_usuario, hora_envio } = data;

        // Normaliza el contenido eliminando espacios en blanco al inicio y final
        const contenidoNormalizado = (contenido || '').trim();
        // Si el mensaje está vacío, no se procesa
        if (!contenidoNormalizado) {
            return;
        }

        // Deduplicacion global por id de mensaje del cliente (entre sockets tambien).
        // Comprueba si este mensaje ya fue procesado a nivel global para evitar duplicados entre sockets
        if (client_msg_id && mensajesProcesadosGlobal.has(client_msg_id)) {
            return;
        }
        // Registra el id del mensaje como procesado y lo elimina tras 30 segundos
        if (client_msg_id) {
            mensajesProcesadosGlobal.add(client_msg_id);
            setTimeout(() => mensajesProcesadosGlobal.delete(client_msg_id), 30000);
        }

        // Deduplicacion por huella semantica para dobles emits casi simultaneos.
        // Crea una huella única combinando sala, usuario y contenido
        const huellaMensaje = `${id_sala}|${id_usuario}|${contenidoNormalizado}`;
        const ahora = Date.now();
        // Comprueba si ya se envió un mensaje idéntico en los últimos 1.5 segundos
        const ultimoEnvio = huellasMensajesRecientes.get(huellaMensaje);
        if (ultimoEnvio && ahora - ultimoEnvio < 1500) {
            return;
        }
        // Registra la huella con su timestamp y la elimina tras 10 segundos
        huellasMensajesRecientes.set(huellaMensaje, ahora);
        setTimeout(() => {
            if (huellasMensajesRecientes.get(huellaMensaje) === ahora) {
                huellasMensajesRecientes.delete(huellaMensaje);
            }
        }, 10000);

        // Deduplicación a nivel local del socket individual
        if (client_msg_id && mensajesProcesados.has(client_msg_id)) {
            return;
        }
        // Registra el id como procesado localmente y lo limpia tras 30 segundos
        if (client_msg_id) {
            mensajesProcesados.add(client_msg_id);
            setTimeout(() => mensajesProcesados.delete(client_msg_id), 30000);
        }

        // Evita duplicados inmediatos del mismo mensaje (doble submit o doble socket emit)
        // Consulta SQL que busca si ya existe un mensaje idéntico en los últimos 2 segundos
        const sqlDuplicado = `
            SELECT id_mensaje
            FROM MENSAJE
            WHERE id_sala = ? AND id_usuario = ? AND contenido = ?
              AND hora_envio >= DATE_SUB(NOW(), INTERVAL 2 SECOND)
            ORDER BY id_mensaje DESC
            LIMIT 1
        `;

        // Ejecuta la comprobación de duplicados en la base de datos
        db.query(sqlDuplicado, [id_sala, id_usuario, contenidoNormalizado], (dupErr, duplicados) => {
            // Si hay error al comprobar, lo registra y detiene
            if (dupErr) {
                console.error("❌ Error comprobando duplicado:", dupErr);
                return;
            }

            // Si ya existe un mensaje duplicado reciente, no lo inserta de nuevo
            if (Array.isArray(duplicados) && duplicados.length > 0) {
                return;
            }

            // 1. Guardamos el mensaje en tu tabla 'mensaje' de MySQL
            // Consulta SQL para insertar el nuevo mensaje
            const sql = "INSERT INTO MENSAJE (id_sala, id_usuario, contenido, hora_envio) VALUES (?, ?, ?, ?)";

            // Ejecuta la inserción del mensaje en la base de datos
            db.query(sql, [id_sala, id_usuario, contenidoNormalizado, formatearFechaMySQL(hora_envio)], (err, result) => {
                // Si hay error al guardar, lo registra y no emite nada
                if (err) {
                    console.error("❌ Error al guardar mensaje:", err);
                    return;
                }

                console.log(`✅ Mensaje guardado en sala ${id_sala}`);

                // 2. Si se guardó bien, emitimos el evento 'recibir_mensaje' incluyendo el id del mensaje
                // Construye el objeto completo del mensaje con el id generado por MySQL
                const mensajeCompleto = {
                    id_mensaje: result.insertId,
                    id_sala,
                    id_usuario,
                    contenido: contenidoNormalizado,
                    nombre_usuario,
                    hora_envio: hora_envio || new Date().toISOString()
                };

                // Evento global para notificaciones fuera del chat (ej: badge de mensajes nuevos)
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
    // Escucha cuando un cliente se desconecta del servidor
    socket.on('disconnect', () => {
        // Obtiene la sala en la que estaba el socket antes de desconectarse
        const salaActual = socket.data?.salaActual;
        if (salaActual) {
            // Emitir conteo actualizado a los que quedan en la sala
            setImmediate(() => {
                // Obtiene cuántos usuarios quedan tras la desconexión
                const count = io.sockets.adapter.rooms.get(String(salaActual))?.size || 0;
                // Notifica a los demás usuarios de la sala el nuevo conteo
                io.to(String(salaActual)).emit('usuarios_sala', { id_sala: salaActual, total: count });
            });
        }
        console.log('🔌 Cliente desconectado');
    });
}

// Exporta la función para registrar los handlers del chat en el servidor de sockets
module.exports = chatHandler;