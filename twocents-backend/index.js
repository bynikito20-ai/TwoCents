const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
// RUTA PARA OBTENER NOTICIAS DE FORMA SEGURA (NUEVO)
// ==========================================
app.get('/api/noticias', async (req, res) => {
    try {
        // Cogemos la llave secreta del archivo .env
        const API_KEY = process.env.NEWS_API_KEY; 
        const url = `https://newsapi.org/v2/everything?q=actualidad OR españa&language=es&sortBy=publishedAt&apiKey=${API_KEY}`;
        
        // El backend hace la petición a NewsAPI
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        
        // Le enviamos los datos limpios al frontend
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
        FROM mensaje m
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
        const idSala = data.id_sala || data; // Por si enviamos solo el idSala
        
        // socket.join() agrupa a los usuarios en una "habitación" específica
        // para que los mensajes no se mezclen con otras salas.
        socket.join(idSala);
        console.log(`💬 ${data.nombre_usuario || 'Usuario'} se unió a la sala: ${idSala}`);
    });

    // ------------------------------------------
    // 5. ENVIAR Y RECIBIR MENSAJES EN TIEMPO REAL
    // ------------------------------------------
    socket.on('enviar_mensaje', (data) => {
        // Estos son los datos que React nos manda cuando alguien pulsa "Enviar"
        const { id_sala, id_usuario, contenido, nombre_usuario, hora_envio } = data;

        // 1. Guardamos el mensaje en tu tabla 'mensaje' de MySQL
        const sql = "INSERT INTO mensaje (id_sala, id_usuario, contenido, hora_envio) VALUES (?, ?, ?, ?)";
        
        db.query(sql, [id_sala, id_usuario, contenido, hora_envio || new Date()], (err, result) => {
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
                contenido,
                nombre_usuario,
                hora_envio: hora_envio || new Date().toISOString()
            };
            
            // io.to(id_sala) asegura que el mensaje SOLO le llegue a los 
            // usuarios que están dentro de esta sala, y no a toda la web.
            io.to(id_sala).emit('recibir_mensaje', mensajeCompleto);
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
            id_usuario: data.id_usuario,
            nombre_usuario: data.nombre_usuario
        });
    });

    socket.on('dejo_de_escribir', (data) => {
        // data contiene { id_sala, id_usuario }
        socket.to(data.id_sala).emit('alguien_dejo_escribir', {
            id_usuario: data.id_usuario
        });
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