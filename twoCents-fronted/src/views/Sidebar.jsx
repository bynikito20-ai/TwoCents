import React from 'react';

/* 1. ZONA DE IMPORTACIONES (IMPORTS)
  En Vite/React, las imágenes locales no se ponen simplemente con la ruta en el HTML. 
  Se "importan" como si fueran variables de JavaScript. Al compilar el proyecto para 
  producción, Vite se encarga de optimizar estas imágenes y poner las rutas correctas.
  El '../' significa "sube una carpeta hacia atrás" (salimos de 'componentes' y entramos en 'recursos').
*/
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

// Declaramos y exportamos el componente funcional 'Sidebar'.
export default function Sidebar() {
  /* 2. ESTADO / DATOS DEL COMPONENTE
    En lugar de escribir 7 veces el código de un botón (copiar y pegar), 
    creamos un 'Array de Objetos' con la información de cada botón. 
    Esto hace que el código sea escalable: si mañana quieres añadir una categoría "Música", 
    solo la añades a esta lista y el menú se actualiza solo.
  */
  const menuOpciones = [
    { id: 1, nombre: 'Deportes', icono: iconDeportes },
    { id: 2, nombre: 'Debates', icono: iconDebates },
    { id: 3, nombre: 'Actualidad', icono: iconActualidad },
    // A esta opción le pasamos una propiedad extra 'activo: true' para simular que estamos en esa vista
    { id: 4, nombre: 'Diversión', icono: iconDiversion, activo: true },
    { id: 5, nombre: 'Política', icono: iconPolitica },
    { id: 6, nombre: 'Recuerdos', icono: iconRecuerdos },
    { id: 7, nombre: 'Reflexión', icono: iconReflexion },
  ];

  /* 3. RENDERIZADO (Lo que devuelve el componente a la pantalla)
    Usamos Tailwind CSS en el 'className' para dar estilos rápidos.
    - w-64: Ancho fijo de 16 rem (aprox 256px).
    - flex flex-col: Convierte el contenedor en una columna (Logo arriba, menú en medio, info abajo).
    - min-h-screen: Ocupa como mínimo el 100% del alto de la pantalla.
  */
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* --- BLOQUE A: LOGOTIPO --- */}
      <div className="p-6 border-b border-gray-100 flex justify-center items-center">
        {/* Usamos la variable 'logoTwoCents' que importamos arriba como 'src' */}
        <img
          src={logoTwoCents}
          alt="TwoCents Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* --- BLOQUE B: MENÚ DE NAVEGACIÓN PRINCIPAL --- */}
      {/* flex-1: Hace que este bloque crezca y ocupe todo el espacio sobrante del centro */}
      {/* overflow-y-auto: Si hay muchas categorías, permite hacer scroll solo en esta parte */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="flex flex-col gap-2 px-4">
          {/* MAGIA DE REACT: La función .map()
            Recorremos el array 'menuOpciones'. Por cada 'opcion' que encuentre, 
            React dibujará un elemento <li> en la pantalla.
            El atributo 'key={opcion.id}' es OBLIGATORIO en React cuando usas .map(), 
            sirve para que React sepa qué elemento exacto actualizar si hay cambios.
          */}
          {menuOpciones.map((opcion) => (
            <li key={opcion.id}>
              {/* Renderizado Condicional de Clases CSS:
                Usamos `${ }` para inyectar lógica. Si 'opcion.activo' es true, 
                le pone fondo rosa y letra roja. Si es false (el resto de botones), 
                le pone letra oscura y un fondo gris clarito al pasar el ratón (hover).
              */}
              <button
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
                  ${
                    opcion.activo
                      ? 'bg-[#FCE1E6] text-[#BA2946] font-bold'
                      : 'text-[#141824] hover:bg-gray-50'
                  }`}
              >
                <img
                  src={opcion.icono}
                  alt={`Icono de ${opcion.nombre}`}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-lg">{opcion.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* --- BLOQUE C: BOTONES INFERIORES (INFO Y USUARIO) --- */}
      {/* Al estar en una columna (flex-col) y tener el bloque B ocupando el centro (flex-1), 
          este bloque C se empuja automáticamente hacia abajo del todo. */}
      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <button className="flex items-center gap-4 px-4 py-3 text-[#141824] hover:bg-gray-50 rounded-xl">
          <img
            src={iconInfo}
            alt="Información"
            className="w-6 h-6 object-contain"
          />
          <span className="text-lg">Información</span>
        </button>
        <button className="flex items-center gap-4 px-4 py-3 text-[#141824] hover:bg-gray-50 rounded-xl">
          <img
            src={iconUsuario}
            alt="Usuario"
            className="w-6 h-6 object-contain"
          />
          <span className="text-lg">[NomUsuario]</span>
        </button>
      </div>
    </aside>
  );
}
