const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Evita procesar dos veces el mismo mensaje cuando hay doble emit casi simultaneo.
const mensajesProcesadosGlobal = new Set();
const huellasMensajesRecientes = new Map();

// ==========================================
// RUTA PARA CREAR UNA NUEVA SALA (NUEVO)
// ==========================================
app.post('/api/salas', (req, res) => {
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
});

// ==========================================
// RUTA PARA OBTENER LAS SALAS POR CATEGORÍA
// ==========================================
app.get('/api/salas/:tipo', (req, res) => {
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
});

// ==========================================
// RUTA PARA OBTENER UNA SALA POR ID
// ==========================================
app.get('/api/sala/:idSala', (req, res) => {
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
});

// ==========================================
// RUTA PARA OBTENER NOTICIAS DE FORMA SEGURA (NUEVO)
// ==========================================
app.get('/api/noticias', async (req, res) => {
    try {
        const API_KEY = process.env.NEWS_API_KEY;
        const url = `https://gnews.io/api/v4/search?q=actualidad&lang=es&country=es&max=10&apikey=${API_KEY}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        res.json(datos);
    } catch (error) {
        console.error("❌ Error al pedir noticias:", error);
        res.status(500).json({ error: 'Error interno pidiendo noticias' });
    }
});

// ==========================================
// RUTA PARA OBTENER EL HISTORIAL DE MENSAJES DE UNA SALA
// ==========================================
app.get('/api/mensajes/:idSala', (req, res) => {
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
        INTO MENSAJE m
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
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,   // ← evita desconexiones en Railway
    pingInterval: 25000,
});

// ==========================================
// CONFIGURACIÓN DE LA CONEXIÓN A MYSQL
// ==========================================
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a la DB:', err);
        return;
    }
    console.log('✅ Conectado a MySQL: twocents_db');
    connection.release();
});
// ==========================================
// LÓGICA DE SOCKETS
// ==========================================
io.on('connection', (socket) => {
    const mensajesProcesados = new Set();
    console.log('👤 Nuevo cliente conectado:', socket.id);

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
            INTO MENSAJE
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
            const sql = "INSERT INTO mensaje (id_sala, id_usuario, contenido, hora_envio) VALUES (?, ?, ?, ?)";

            db.query(sql, [id_sala, id_usuario, contenidoNormalizado, hora_envio || new Date()], (err, result) => {
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
    // ------------------------------------------
    // 6. EVENTOS DE "ESCRIBIENDO..." (OPCIONAL PERO RECOMENDADO)
    // ------------------------------------------
    socket.on('escribiendo', (data) => {
        // data contiene { id_sala, id_usuario, nombre_usuario }
        // socket.to() lo envía a todos en la sala EXCEPTO al que está escribiendo
        socket.to(data.id_sala).emit('alguien_escribiendo', {
            id_sala: data.id_sala,
            id_usuario: data.id_usuario,
            nombre_usuario: data.nombre_usuario
        });
    });

    socket.on('dejo_de_escribir', (data) => {
        // data contiene { id_sala, id_usuario }
        socket.to(data.id_sala).emit('alguien_dejo_escribir', {
            id_sala: data.id_sala,
            id_usuario: data.id_usuario
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
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});