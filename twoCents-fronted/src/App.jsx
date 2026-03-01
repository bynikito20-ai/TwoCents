// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IniciarSesion from './views/IniciarSesion';
import Registro from './views/Registro';
import Sidebar from './componentes/Sidebar';
import Inicio from './views/Inicio';
import Perfil from './views/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta "/" es la principal. Entra directo al Login */}
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Creamos la nueva ruta '/inicio' */}
        <Route
          path="/inicio"
          element={
            // Este div es el "velcro" que junta las dos piezas
            <div className="flex w-full min-h-screen">
              <Sidebar />
              <Inicio />
            </div>
          }
        />

        <Route
          path="/perfil"
          element={
            <div className="flex w-full min-h-screen">
              <Sidebar />
              <Perfil />
            </div>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
