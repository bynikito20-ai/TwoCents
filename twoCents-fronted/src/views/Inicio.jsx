import React, { useState, useEffect } from 'react';
import './css/Inicio.css';

// 1. IMPORTAMOS LA FUNCIÓN DESDE TU NUEVA CARPETA DE SERVICIOS
// (Ojo: Asegúrate de que la ruta '../servicios/peticionesApi' cuadra con tus carpetas. 
// Si Inicio.jsx está en la misma carpeta que 'servicios', sería './servicios/peticionesApi')
import { obtenerNoticias } from '../servicios/peticionesApi';

export default function Inicio() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📡 Pidiendo noticias a través de nuestro servicio...");

    // 2. USAMOS LA FUNCIÓN LIMPIA EN LUGAR DE TODO EL FETCH
    obtenerNoticias()
      .then((datos) => {
        console.log("📦 Paquete recibido del servidor:", datos); 

        if (datos.articles && datos.articles.length > 0) {
          setNoticias(datos.articles.slice(0, 12));
        } else {
          setError(`La API no envió noticias. Estado: ${datos.status}`);
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("❌ Error en la conexión:", err);
        setError("Falló la conexión con el servidor de noticias.");
        setCargando(false);
      });
  }, []); 

  return (
    <div className="pagina-inicio">
      <h1 className="titulo-principal">LAS NOTICIAS DE HOY</h1>

      {cargando && <h3 style={{ textAlign: 'center' }}>Cargando las últimas noticias... ⏳</h3>}
      {error && <h3 style={{ color: 'red', textAlign: 'center' }}>Ups: {error}</h3>}

      {!cargando && !error && (
        <div className="contenedor-noticias">
          {noticias.map((noticia, index) => {
            if (!noticia.title || noticia.title === '[Removed]') return null;

            return (
              <article key={index} className="tarjeta-noticia">
                <h2 className="noticia-titulo">{noticia.title}</h2>
                <img
                  src={noticia.urlToImage || 'https://via.placeholder.com/400x225?text=Sin+Imagen'}
                  alt="Imagen de la noticia"
                  className="noticia-imagen"
                />
                <div className="noticia-pie">
                  <a 
                    href={noticia.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="boton-ver-mas"
                    style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
                  >
                    Leer noticia
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}