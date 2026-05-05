// Guardamos la URL base para no repetirla
export const URL_BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Creamos una función que solo se encarga de ir a buscar las noticias
export const obtenerNoticias = async () => {
    try {
        const respuesta = await fetch(`${URL_BACKEND}/api/noticias`);
        if (!respuesta.ok) {
            throw new Error('Error al conectar con el servidor de noticias');
        }
        const datos = await respuesta.json();
        return datos; // Devolvemos las noticias limpias
    } catch (error) {
        console.error("❌ Error en la API:", error);
        throw error; 
    }
};

// Si en el futuro tienes más peticiones (ej: actualizar perfil, borrar cuenta),
// crearías aquí más funciones parecidas y las exportarías.