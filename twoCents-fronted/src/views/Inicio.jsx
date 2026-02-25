import React from 'react';
import './Inicio.css';

export default function Inicio() {
  return (
    <div className="pagina-inicio">
      <h1 className="titulo-principal">LAS NOTICIAS DE HOY</h1>

      <div className="contenedor-noticias">
        {/* --- TARJETA 1 (Arriba Izquierda) --- */}
        <article className="tarjeta-noticia">
          <h2 className="noticia-titulo">
            DAZN se queda con todo el Mundial 2026 en la tele de pago en España
          </h2>
          <img
            src="https://heute-at-prod-images.imgix.net/2024/12/04/a22ca6ef-688e-47cb-a90f-f0ad55ad5a2e.jpeg?rect=0%2C342%2C4000%2C2250&auto=format"
            alt="Mundial 2026"
            className="noticia-imagen"
          />
          <div className="noticia-pie">
            <button className="boton-ver-mas">Ver más</button>
          </div>
        </article>

        {/* --- TARJETA 2 (Arriba Derecha) --- */}
        <article className="tarjeta-noticia">
          <h2 className="noticia-titulo">
            ¿Podrá Aston Martin F1 salir del bache? ¿Cuánto tiempo tardará?
          </h2>
          <img
            src="https://cdn-8.motorsport.com/images/amp/YE9wNgMY/s1200/lance-stroll-aston-martin-raci.webp"
            alt="Jugadores de fútbol"
            className="noticia-imagen"
          />
          <div className="noticia-pie">
            <button className="boton-ver-mas">Ver más</button>
          </div>
        </article>

        {/* --- TARJETA 3 (Abajo Izquierda) --- */}
        <article className="tarjeta-noticia">
          <h2 className="noticia-titulo">
            Yolanda Díaz renuncia a ser la candidata de la izquierda confederal
          </h2>
          <img
            src="https://imagenes.elpais.com/resizer/v2/3JD24VYZWFH6ZJ5CMKCZY6UAF4.jpg?auth=ea667dcfd63aa2f3dbed25372909bb791181bf946557093be070784bd2f3682c&width=414&height=233&smart=true"
            alt="Fútbol"
            className="noticia-imagen"
          />
          <div className="noticia-pie">
            <button className="boton-ver-mas">Ver más</button>
          </div>
        </article>

        {/* --- TARJETA 4 (Abajo Derecha) --- */}
        <article className="tarjeta-noticia">
          <h2 className="noticia-titulo">
            Una tienda digital filtra el precio de GTA 6 para consola y PC
          </h2>
          <img
            src="https://hardzone.es/app/uploads-hardzone.es/2026/02/cartel-anunciador-gta-6.jpg?quality=80"
            alt="Tenis"
            className="noticia-imagen"
          />
          <div className="noticia-pie">
            <button className="boton-ver-mas">Ver más</button>
          </div>
        </article>
      </div>
    </div>
  );
}
