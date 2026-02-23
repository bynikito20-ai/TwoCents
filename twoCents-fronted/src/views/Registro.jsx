import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import './IniciarSesion.css'; 
import { Link } from 'react-router-dom';


export default function Registro() {
  return (
    <div className="contenedor-login">
      
      <div className="tarjeta-login">
        <div className='cabecera-registro'>
          <img src={logoTwoCents} alt="logoTwoCents" className='logo'/>
            <h1>Registrarse</h1>  
        </div>
        
        <p className='linea-divisoria'>_______________________________________________</p>
        
        <form className="formulario">
          <div className="grupo-input">
            <input type="text" placeholder="Correo eléctronico..." />
          </div>

          <div className="grupo-input">
            <input type="password" placeholder="Nombre de Usuario..." />
          </div>

          <div className="grupo-input">
            <input type="password" placeholder="Contraseña..." />
          </div>
          
          <button type="button" className="boton-entrar">
            Registrarse
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'black' }}>
          ¿Ya tienes cuenta?,  <Link className='link' to="/">Iniciar Sesion</Link>
        </p>
      </div>

    </div>
  )
}