// ==========================================
// OBTENER NOTICIAS DE FORMA SEGURA (proxy a GNews)
// ==========================================
async function obtenerNoticias(req, res) {
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
}

module.exports = {
    obtenerNoticias
};
