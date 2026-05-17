// Archivo que gestiona los eventos de "escribiendo..." en tiempo real mediante WebSockets.
// Permite mostrar a los demás usuarios de la sala cuándo alguien está escribiendo un mensaje.

// ==========================================
// HANDLERS DE "ESCRIBIENDO..." (OPCIONAL PERO RECOMENDADO)
// ==========================================
// Función que recibe la instancia de Socket.IO y el socket del cliente conectado
function typingHandler(io, socket) {
    // Escucha cuando un usuario empieza a escribir en el chat
    socket.on('escribiendo', (data) => {
        // data contiene { id_sala, id_usuario, nombre_usuario }
        // socket.to() lo envía a todos en la sala EXCEPTO al que está escribiendo
        socket.to(data.id_sala).emit('alguien_escribiendo', {
            id_sala: data.id_sala,
            id_usuario: data.id_usuario,
            nombre_usuario: data.nombre_usuario
        });
    });

    // Escucha cuando un usuario deja de escribir en el chat
    socket.on('dejo_de_escribir', (data) => {
        // data contiene { id_sala, id_usuario }
        // Notifica a los demás usuarios de la sala que este usuario dejó de escribir
        socket.to(data.id_sala).emit('alguien_dejo_escribir', {
            id_sala: data.id_sala,
            id_usuario: data.id_usuario
        });
    });
}

// Exporta la función para registrar los handlers de escritura en el servidor de sockets
module.exports = typingHandler;