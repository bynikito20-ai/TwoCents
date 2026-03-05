import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../componentes/Sidebar.jsx';
import './css/Perfil.css'; 

export default function Perfil() {
  const navigate = useNavigate();
  // Recuperamos el nombre del usuario
  const [nombreUsuario] = useState(localStorage.getItem('usuarioLogeado'));
  const [correoUsuario] = useState(localStorage.getItem('correoLogeado'));
  const [modoOscuro, setModoOscuro] = useState(false);

  // 1. Al cargar la página, comprobamos si el usuario ya tenía el modo oscuro activado
  useEffect(() => {
    const temaGuardado = localStorage.getItem('temaOscuro');
    if (temaGuardado === 'true') {
      setModoOscuro(true);
      document.body.classList.add('modo-oscuro'); // Le ponemos una clase al <body>
    }
  }, []);

  // 2. Función para alternar entre claro y oscuro
  const cambiarTema = () => {
    const nuevoEstado = !modoOscuro;
    setModoOscuro(nuevoEstado);
    localStorage.setItem('temaOscuro', nuevoEstado); // Lo guardamos para que no se borre al recargar
    
    if (nuevoEstado) {
      document.body.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
    }
  };

  // 3. Función para cerrar sesión (la hemos movido aquí)
  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogeado');
    navigate('/'); // Te devuelve a la pantalla de Login
  };

  return (
    <div className="pagina-inicio"> {/* Usamos tu misma clase para mantener el estilo base */}
      <Sidebar />
      <h1 className="titulo-principal">MI PERFIL</h1>
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--fondo-tarjeta, #fff)', borderRadius: '10px' }}>
        
        {/* SECCIÓN: INFORMACIÓN DE LA CUENTA */}
        <h2> Información de la cuenta</h2>
        <p style={{ fontSize: '18px' }}><strong>Usuario:</strong> {nombreUsuario}</p>
        <p style={{ fontSize: '18px' }}><strong>Correo:</strong> {correoUsuario}</p>
        
        

        {/* SECCIÓN: APARIENCIA */}
        <h2>Apariencia</h2>
        <button 
          onClick={cambiarTema}
          className={`toggle ${modoOscuro ? "dark" : "light"}`}
        >
          <div className="icon">
            {modoOscuro ? "🌙" : "☀️"}
          </div>
        </button>

        

        {/* SECCIÓN: CERRAR SESIÓN */}
        <h2>Sesión</h2>
        <button 
          onClick={cerrarSesion}
          style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px', backgroundColor: '#eb322c', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Cerrar Sesión
        </button>

      </div>
    </div>
  );
}