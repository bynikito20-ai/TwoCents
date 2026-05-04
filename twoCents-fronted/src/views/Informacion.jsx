import React from 'react';
import Sidebar from '../componentes/Sidebar.jsx';
import './css/Informacion.css';
import { useFondoBody } from '../contexto/useFondoResponsive';
import fondoDesktopClaro from '../recursos/imagenes/fondos_chats_desktop/informacion_desktop_claro.png';
import fondoDesktopOscuro from '../recursos/imagenes/fondos_chats_desktop/informacion_desktop_oscuro.png';
import fondoMovilClaro from '../recursos/imagenes/fondos_chats_movil/informacion_movil_claro.png';
import fondoMovilOscuro from '../recursos/imagenes/fondos_chats_movil/informacion_movil_oscuro.png';

const Informacion = () => {
  useFondoBody({
    desktopClaro: fondoDesktopClaro,
    desktopOscuro: fondoDesktopOscuro,
    movilClaro: fondoMovilClaro,
    movilOscuro: fondoMovilOscuro,
  });

  return (
    <div className="info-layout">
      <Sidebar />

      {/* Usamos una etiqueta <main> para el contenido y que pueda hacer scroll si es muy largo */}
      <main className="informacion-main">
        <header className="vista-header vista-header--informacion">
          <h1 className="vista-header__title">TwoCents</h1>
          <p>Autores: Nicolas Cirstea y Héctor Carbajo</p>
          <p>Desarrollo de Aplicaciones Web</p>
        </header>

        <nav>
          <a href="#resumen">Resumen</a>
          <a href="#objetivos">Objetivos</a>
          <a href="#metodologia">Metodología</a>
          <a href="#descargas">Descargas</a>
        </nav>

        <div className="container">
          <section id="resumen">
            <h2>Resumen</h2>
            <p>
              El nombre TwoCents proviene de la expresión inglesa popular "to
              give my two cents" (dar mi humilde opinión). El presente proyecto
              consiste en el diseño, desarrollo y despliegue de una plataforma
              web de comunicación en tiempo real. En un entorno digital donde la
              inmediatez y la interacción social son prioritarias, TwoCents nace
              para ofrecer una solución de chat fluida, organizada y abierta. La
              aplicación se concibe como un "ágora digital" estructurada en
              salas temáticas, permitiendo a los usuarios debatir e intercambiar
              opiniones de manera instantánea. A diferencia de los foros
              tradicionales estáticos, TwoCents prioriza la bidireccionalidad
              instantánea, garantizando que la conversación fluya sin
              interrupciones ni recargas de página. El sistema está diseñado
              para ser escalable y accesible, proporcionando una experiencia de
              usuario (UX) ágil tanto en ordenadores como en dispositivos
              móviles, eliminando barreras de entrada para fomentar la
              participación en debates de actualidad y de interés general.
            </p>
          </section>

          <section id="objetivos">
            <h2>Objetivos</h2>
            <ul>
              <li>
                <strong>Objetivo Principal:</strong> Diseñar y desarrollar una
                aplicación web integral que permita la interacción en tiempo
                real entre usuarios, garantizando una experiencia de usuario
                fluida y una arquitectura de sistemas escalable y eficiente.
              </li>
              <li>
                <strong>Objetivos Específicos:</strong>
                <ul>
                  <li>
                    Implementación de Interfaz Reactiva: Desarrollar una
                    interfaz de usuario (Frontend) mediante el ecosistema de
                    React, asegurando una navegación rápida, componentes
                    reutilizables y un diseño adaptativo (responsive).
                  </li>
                  <li>
                    Gestión de Datos en Tiempo Real: Integrar el protocolo
                    WebSockets a través de Socket.io para establecer una
                    comunicación bidireccional constante entre cliente y
                    servidor, eliminando la necesidad de refrescos manuales de
                    página.
                  </li>
                  <li>
                    Construcción de una API Robusta: Configurar un entorno de
                    servidor (Backend) sólido utilizando Node.js, capaz de
                    gestionar peticiones de forma asíncrona y manejar la lógica
                    de negocio de manera centralizada.
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section id="metodologia">
            <h2>Metodología y Desarrollo</h2>
            <p>
              El desarrollo del sistema se ha basado en una arquitectura
              desacoplada utilizando React para la construcción de una interfaz
              de usuario dinámica y reactiva en el frontend. El backend se ha
              implementado con Node.js, aprovechando su eficiencia en el manejo
              de operaciones asíncronas, mientras que la comunicación
              bidireccional y en tiempo real entre ambas capas se ha gestionado
              mediante Socket.io, garantizando una sincronización de datos
              instantánea.
            </p>
          </section>

          <section id="descargas">
            <h2>Recursos y Descargas</h2>
            <p>
              Puedes acceder a la documentación completa o al código fuente en
              los siguientes enlaces:
            </p>
            <a href="#" className="btn">
              Ver PDF del TFG
            </a>
            {/* Fíjate cómo el atributo style ahora es un objeto en JSX */}
            <a
              href="https://github.com/bynikito20-ai/TwoCents"
              className="btn btn--github"
            >
              Ver Repositorio (GitHub)
            </a>
          </section>
        </div>

        <footer className="informacion-footer">
          <p>&copy; 2026 - I.E.S Santiago Hernández</p>
        </footer>
      </main>
    </div>
  );
};

export default Informacion;
