import React from 'react';
import './Sidebar.css';

// IMPORTACIONES DE LOS LOGOS
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import iconDeportes from '../recursos/imagenes/deportes.png';
import iconDebates from '../recursos/imagenes/Debate.png';
import iconActualidad from '../recursos/imagenes/Actualidad.png';
import iconDiversion from '../recursos/imagenes/Diversion.png';
import iconPolitica from '../recursos/imagenes/Politica.png';
import iconRecuerdos from '../recursos/imagenes/Recuerdos.png';
import iconReflexion from '../recursos/imagenes/Reflexivas.png';
import iconInfo from '../recursos/imagenes/acerca-de.png';
import iconUsuario from '../recursos/imagenes/avatar.png';

// AQUÍ EL CAMBIO: Dejamos paginaActiva vacío ('') por defecto para que no marque nada
export default function Sidebar({ paginaActiva = '' }) {
  const menuOpciones = [
    { id: 1, nombre: 'Deportes', icono: iconDeportes },
    { id: 2, nombre: 'Debates', icono: iconDebates },
    { id: 3, nombre: 'Actualidad', icono: iconActualidad },
    { id: 4, nombre: 'Diversión', icono: iconDiversion },
    { id: 5, nombre: 'Política', icono: iconPolitica },
    { id: 6, nombre: 'Recuerdos', icono: iconRecuerdos },
    { id: 7, nombre: 'Reflexión', icono: iconReflexion },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-caja">
        <img src={logoTwoCents} alt="TwoCents" className="sidebar-logo" />
      </div>

      <hr className="separador" />

      <nav className="menu-nav">
        {menuOpciones.map((opcion) => {
          const esActiva = opcion.nombre === paginaActiva;

          return (
            <button
              key={opcion.id}
              className={`boton-opcion ${esActiva ? 'activa' : ''}`}
            >
              <div className="icono-caja">
                <img
                  src={opcion.icono}
                  alt={opcion.nombre}
                  className="icono-img"
                />
              </div>
              <span className="texto-opcion">{opcion.nombre}</span>
            </button>
          );
        })}
      </nav>

      <hr className="separador" />

      <div className="menu-abajo">
        <button className="boton-opcion">
          <div className="icono-caja">
            <img src={iconInfo} alt="Información" className="icono-img" />
          </div>
          <span className="texto-opcion">Información</span>
        </button>

        <button className="boton-opcion">
          <div className="icono-caja">
            <img src={iconUsuario} alt="Usuario" className="icono-img" />
          </div>
          <span className="texto-opcion">[NomUsuario]</span>
        </button>
      </div>
    </aside>
  );
}
