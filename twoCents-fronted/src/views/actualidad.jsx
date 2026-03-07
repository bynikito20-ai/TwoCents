import React from 'react';
import Sidebar from '../componentes/sidebar';
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de actualidad correcta
import iconoActualidad from '../recursos/imagenes/Actualidad.png';

const Actualidad = () => {
  // Lista de chats de ejemplo con temática de actualidad y noticias
  const chatsActualidad = [
    {
      id: 1,
      title: 'Noticias Internacionales 🌍',
      lastMsg: '¿Habéis visto los acuerdos de la última cumbre sobre el clima?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 2,
      title: 'Tecnología y Ciencia',
      lastMsg:
        'El nuevo lanzamiento espacial ha sido un éxito total. ¡Qué locura!',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 3,
      title: 'Economía Diaria',
      lastMsg:
        'Los precios de los alquileres en el centro siguen subiendo este mes...',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 4,
      title: 'Sucesos Locales',
      lastMsg:
        'Atentos: mañana hay corte de tráfico en la avenida principal por las obras.',
      unread: 0,
      hasUpdate: false,
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Actualidad</h1>
        </header>

        <section className="chat-list">
          {chatsActualidad.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Actualidad */}
                <img src={iconoActualidad} alt="Icono Actualidad" />
                {chat.hasUpdate && <div className="status-dot"></div>}
              </div>

              <div className="chat-info">
                <h3>{chat.title}</h3>
                <p>{chat.lastMsg}</p>
              </div>

              {/* Si hay mensajes sin leer, mostramos el contador (ahora oculto) */}
              {chat.unread > 0 && (
                <div className="msg-count">{chat.unread}</div>
              )}
            </div>
          ))}
        </section>

        <button
          className="btn-add-chat"
          title="Crear nuevo chat"
          onClick={() =>
            alert(
              'Pronto crearemos el formulario para nuevos grupos de noticias'
            )
          }
        >
          +
        </button>
      </main>
    </div>
  );
};

export default Actualidad;
