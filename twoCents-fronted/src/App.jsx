// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos la página que acabamos de crear
import IniciarSesion from './views/IniciarSesion';
import Registro from './views/Registro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IniciarSesion />} />
        <Route path='/registro' element={<Registro />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;