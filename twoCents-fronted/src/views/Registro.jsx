import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../servicios/useSocket';

// Asegúrate de que la ruta a tu logo y tu CSS son correctas
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import './IniciarSesion.css'; // Usamos el mismo CSS para que la tarjeta se vea igual

export default function Registro() {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. EL ESTADO DE LA TARJETA
  const [alerta, setAlerta] = useState({visible: false, mensaje: '', tipo: ''});
  
  const navigate = useNavigate();

  // 2. ESCUCHAMOS AL SERVIDOR
  useEffect(() => {
    socket.on('registro_resultado', (respuesta) => {
      if (respuesta.success) {
        setAlerta({ 
            visible: true, 
            mensaje: `¡Registro exitoso! Ya puedes iniciar sesión.`, 
            tipo: 'exito' 
        });
        
        setTimeout(() => {
          navigate('/'); // Te manda al login tras 1.5s
        }, 1500);

      } else {
        setAlerta({ 
            visible: true, 
            mensaje: respuesta.message, 
            tipo: 'error' 
        });
      }
    });

    return () => socket.off('registro_resultado');
  }, [navigate]);

  // 3. ENVIAMOS LOS DATOS
  const manejarRegistro = (e) => {
    e.preventDefault();
    socket.emit('registrar_usuario', { usuario, email, password });
  };

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        
        {/* --- LA TARJETA EMERGENTE (MODAL) --- */}
        {alerta.visible && (
          <div className="alerta-overlay">
            <div className="alerta-tarjeta">
              <h2 style={{ color: alerta.tipo === 'exito' ? '#a83250' : '#a83250' }}>
                {alerta.tipo === 'exito' ? '¡Genial!' : 'Ups...'}
              </h2>
              <p className="linea-divisoria">________________________</p>
              <p style={{ margin: '20px 0', fontSize: '18px', color: 'black' }}>{alerta.mensaje}</p>
              
              {alerta.tipo === 'error' && (
                <button 
                  className="boton-entrar" 
                  onClick={() => setAlerta({ visible: false, mensaje: '', tipo: '' })}
                >
                  Reintentar
                </button>
              )}
            </div>
          </div>
        )}
        {/* ---------------------------------- */}

        <div className='cabecera-registro'>
          <img src={logoTwoCents} alt="logoTwoCents" className='logo'/>
          <h1>Registrase</h1>  
        </div>
        
        <p className='linea-divisoria'>_______________________________________________</p>
        
        <form className="formulario" onSubmit={manejarRegistro}>
          
          <div className="grupo-input">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
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
            Registrarse
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'black' }}>
          ¿Ya tienes cuenta? <Link className='link' to="/">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}