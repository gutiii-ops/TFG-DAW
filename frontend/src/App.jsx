/* =======================================================================================================================
                        App.jsx - Orquestador general para ejecutar los diferentes módulos de React
======================================================================================================================= */
// Import base de React
import React from 'react';
// Import de los módulos necesarios para el enrutamiento
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import de las páginas a mostrar
import Home from './pages/Public/home.jsx';

// Componente principal de la aplicación que maneja el enrutamiento entre las diferentes páginas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;