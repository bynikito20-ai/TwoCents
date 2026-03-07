import React from 'react';
import Sidebar from '../componentes/sidebar';
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de reflexivas correcta
import iconoReflexivas from '../recursos/imagenes/Reflexivas.png';

const Reflexivas = () => {
  // Lista de chats de ejemplo con temática de reflexión y filosofía
  const chatsReflexivas = [
    {
      id: 1,
      title: 'Filosofía Cotidiana 🧠',
      lastMsg:
        '¿Creéis que el destino está escrito o lo creamos nosotros cada día?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 2,
      title: 'Crecimiento Personal',
      lastMsg:
        'Ayer terminé un libro increíble sobre la gestión de las emociones.',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 3,
      title: 'Meditación y Mindfulness 🧘‍♂️',
      lastMsg:
        '¿Alguien más ha probado a meditar 10 minutos nada más despertarse?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 4,
      title: 'El sentido del arte',
      lastMsg:
        'A veces me pregunto si el arte debe ser bello o simplemente transmitir algo...',
      unread: 0,
      hasUpdate: false,
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Reflexión</h1>
        </header>

        <section className="chat-list">
          {chatsReflexivas.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Reflexivas */}
                <img src={iconoReflexivas} alt="Icono Reflexión" />
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
              'Pronto crearemos el formulario para nuevos grupos de reflexión'
            )
          }
        >
          +
        </button>
      </main>
    </div>
  );
};

export default Reflexivas;
