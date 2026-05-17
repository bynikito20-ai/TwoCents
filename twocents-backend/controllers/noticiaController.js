// ==========================================
// OBTENER NOTICIAS DE FORMA SEGURA (proxy a GNews)
// ==========================================
// Función asíncrona que actúa como proxy entre el cliente y la API de GNews
async function obtenerNoticias(req, res) {
    try {
        // Obtiene la clave de la API de GNews desde las variables de entorno
        const API_KEY = process.env.NEWS_API_KEY;
        // Construye la URL de la petición con los parámetros: búsqueda de actualidad, en español, máximo 10 resultados
        const url = `https://gnews.io/api/v4/search?q=actualidad&lang=es&country=es&max=10&apikey=${API_KEY}`;
        // Realiza la petición HTTP a la API de GNews
        const respuesta = await fetch(url);
        // Convierte la respuesta a formato JSON
        const datos = await respuesta.json();
        // Devuelve los datos de las noticias al cliente
        res.json(datos);
    } catch (error) {
        // Si ocurre cualquier error en la petición, lo registra en consola
        console.error("❌ Error al pedir noticias:", error);
        // Devuelve un error 500 al cliente indicando fallo interno
        res.status(500).json({ error: 'Error interno pidiendo noticias' });
    }
}

// Exporta la función para usarla como controlador en las rutas
module.exports = {
    obtenerNoticias
};