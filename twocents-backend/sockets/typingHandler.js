// ==========================================
// HANDLERS DE "ESCRIBIENDO..." (OPCIONAL PERO RECOMENDADO)
// ==========================================
function typingHandler(io, socket) {
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
}

module.exports = typingHandler;
