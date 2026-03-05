// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IniciarSesion from './views/IniciarSesion';
import Registro from './views/Registro';
import Sidebar from './componentes/Sidebar';
import Inicio from './views/Inicio';
import Perfil from './views/Perfil';
import Informacion from './views/Informacion';
import Diversion from './views/diversion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta "/" es la principal. Entra directo al Login */}
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/diversion" element={<Diversion />} />

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
