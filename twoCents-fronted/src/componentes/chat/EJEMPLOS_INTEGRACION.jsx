/**
 * EJEMPLO DE INTEGRACIÓN: Cómo usar ChatRoom desde tus vistas
 * 
 * Este archivo muestra ejemplos prácticos de cómo navegar a una sala de chat
 * desde tus componentes existentes (actualidad, debates, deportes, etc.)
 */

// ============================================
// EJEMPLO 1: Desde una vista de categoría
// ============================================

import { useNavigate } from 'react-router-dom';

export function EjemploDesdeActualidad() {
  const navigate = useNavigate();

  const abrirChat = (idSala) => {
    // Navega a la sala de chat
    navigate(`/sala/${idSala}`);
  };

  const salas = [
    { id_sala: 1, nombre: 'Política España', descripcion: 'Noticias políticas' },
    { id_sala: 2, nombre: 'Economía', descripcion: 'Análisis económico' },
  ];

  return (
    <div>
      {salas.map((sala) => (
        <div key={sala.id_sala} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
          <h3>{sala.nombre}</h3>
          <p>{sala.descripcion}</p>
          <button onClick={() => abrirChat(sala.id_sala)}>
            Entrar al chat
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EJEMPLO 2: Modificar TarjetaNoticia para abrir chat
// ============================================

// @ src/componentes/noticias/TarjetaNoticia.jsx
// Agregá estas líneas:

/*
import { useNavigate } from 'react-router-dom';

export default function TarjetaNoticia({ noticia, idSalaAsociada }) {
  const navigate = useNavigate();

  const handleAbrirChat = () => {
    navigate(`/sala/${idSalaAsociada}`);
  };

  return (
    <article className="tarjeta-noticia">
      <h2>{noticia.title}</h2>
      <p>{noticia.description}</p>
      <button onClick={handleAbrirChat}>
        Comentar en el chat
      </button>
    </article>
  );
}
*/

// ============================================
// EJEMPLO 3: Hook personalizado para navegar a sala
// ============================================

/*
Crea este archivo: src/hooks/useNavigateSala.js

import { useNavigate } from 'react-router-dom';

export const useNavigateSala = () => {
  const navigate = useNavigate();

  const irASala = (idSala) => {
    navigate(`/sala/${idSala}`);
  };

  return { irASala };
};

// Uso en cualquier componente:
import { useNavigateSala } from '../hooks/useNavigateSala';

function MiComponente() {
  const { irASala } = useNavigateSala();

  return (
    <button onClick={() => irASala(5)}>
      Ir a sala 5
    </button>
  );
}
*/

// ============================================
// EJEMPLO 4: Modificar una lista de salas
// ============================================

/*
@ src/views/actualidad.jsx
Agrega la navegación a las salas:

import { useNavigate } from 'react-router-dom';

const Actualidad = () => {
  const navigate = useNavigate();
  const [chatsActualidad, setChatsActualidad] = useState([]);

  const abrirSala = (idSala) => {
    navigate(`/sala/${idSala}`);
  };

  return (
    <div className="pagina-categoria">
      <Sidebar />
      <div className="contenedor-salas">
        {chatsActualidad.map((sala) => (
          <div key={sala.id} className="tarjeta-sala">
            <h3>{sala.title}</h3>
            <p>{sala.desc}</p>
            <button 
              onClick={() => abrirSala(sala.id)}
              className="boton-entrar-sala"
            >
              Entrar al chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
*/

// ============================================
// EJEMPLO 5: Componente Sala Clickeable
// ============================================

/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TarjetaSala.css';

export default function TarjetaSala({ sala }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sala/${sala.id_sala}`);
  };

  return (
    <div className="tarjeta-sala" onClick={handleClick}>
      <div className="tarjeta-sala__contenido">
        <h3 className="tarjeta-sala__titulo">{sala.nombre}</h3>
        <p className="tarjeta-sala__descripcion">{sala.descripcion}</p>
        <div className="tarjeta-sala__meta">
          <span className="tarjeta-sala__tipo">
            {sala.tipo}
          </span>
          <span className="tarjeta-sala__usuarios">
            {sala.usuarios_activos || 0} usuarios
          </span>
        </div>
      </div>
    </div>
  );
}
*/

// ============================================
// EJEMPLO 6: Volver atrás desde ChatRoom
// ============================================

/*
Si quieres agregar un botón para volver atrás dentro de ChatRoom:

En src/componentes/chat/ChatRoom.jsx, agrega esto al estado:

const navigate = useNavigate();

Y en el JSX, antes del contenedor de mensajes:

<div className="chatroom__header">
  <button 
    onClick={() => navigate(-1)}
    className="chatroom__back-button"
  >
    ← Volver
  </button>
  <h1 className="chatroom__title">Sala de Chat</h1>
</div>

En ChatRoom.css agrega:

.chatroom__header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.chatroom__back-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #667eea;
  padding: 8px;
  margin-right: 12px;
}

.chatroom__back-button:hover {
  color: #764ba2;
}

.chatroom__title {
  margin: 0;
  font-size: 1.3rem;
  color: #212529;
}
*/

// ============================================
// EJEMPLO 7: Pasar ID de sala como prop
// ============================================

/*
Si tienes un componente padre que conoce el idSala:

function ComponentePadre() {
  const [idSalactual] = useState(5);

  return (
    <ListaSalas idSala={idSalactual} />
  );
}

function ListaSalas({ idSala }) {
  const navigate = useNavigate();

  const handleAbrirChat = () => {
    navigate(`/sala/${idSala}`);
  };

  return (
    <button onClick={handleAbrirChat}>
      Abrir chat de sala {idSala}
    </button>
  );
}
*/

export default function IntegracionChatRoom() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Ejemplos de Integración - ChatRoom</h1>
      <p>Ver el código fuente de este archivo para ver ejemplos prácticos.</p>
      <p>Descomenta los ejemplos que necesites y adáptalos a tus componentes.</p>
    </div>
  );
}
