import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Ajusta esta ruta si tu carpeta de imágenes está en otro sitio
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
// Importamos tu CSS unificado
import './IniciarSesion.css'; 

// Conectamos con el backend de Node
const socket = io('http://localhost:3001');

export default function IniciarSesion() {
  // 1. Guardamos lo que el usuario escribe
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // 2. Escuchamos la respuesta del servidor al intentar entrar
  useEffect(() => {
    socket.on('login_resultado', (respuesta) => {
      if (respuesta.success) {
        alert('¡Bienvenido ' + respuesta.usuario.nombre + '!');
        // Aquí luego cambiaremos '/inicio' por la ruta de tu pantalla principal (el Ágora)
        // navigate('/inicio'); 
      } else {
        alert('Error: ' + respuesta.message);
      }
    });

    // Limpiamos el evento al salir de la pantalla
    return () => socket.off('login_resultado');
  }, [navigate]);

  // 3. Función al darle al botón rojo
  const manejarLogin = (e) => {
    e.preventDefault();
    socket.emit('login_usuario', { usuario, password });
  };

  return (
    // EL FONDO (La habitación)
    <div className="contenedor-login">
      
      {/* LA CAJA ROSA (El mueble) */}
      <div className="tarjeta-login">
        <div className='cabecera-registro'>
          <img src={logoTwoCents} alt="logoTwoCents" className='logo'/>
          <h1>Inicio de Sesión</h1>  
        </div>
        
        <p className='linea-divisoria'>_______________________________________________</p>
        
        <form className="formulario" onSubmit={manejarLogin}>
          <div className="grupo-input">
            <input 
              type="text" 
              placeholder="Nombre de Usuario" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="grupo-input">
            <input 
              type="password" 
              placeholder="Contraseña..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="boton-entrar">
            Iniciar Sesión
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'black' }}>
          {/* Asegúrate de que "/registro" es la ruta correcta en tu App.jsx */}
          ¿No tienes cuenta? <Link className='link' to="/registro">Regístrate</Link>
        </p>
      </div>

    </div>
  );
}