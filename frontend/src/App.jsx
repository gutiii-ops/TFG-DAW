/* =======================================================================================================================
                        App.jsx - Orquestador general para ejecutar los diferentes módulos de React
======================================================================================================================= */
// Import base de React
import { StrictMode, useEffect } from 'react'
// Import de los módulos necesarios para el enrutamiento
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import de las páginas a mostrar
import Home from './pages/Public/home.jsx'
// Import del componente Login
import { Login } from './components/login.jsx'
// Import del inicializador de login popup
import { initLoginPopup } from './services/loginPopup.js'

// Componente principal de la aplicación que maneja el enrutamiento entre las diferentes páginas
function App() {
  useEffect(() => {
        // Ejecutamos tu función
        initLoginPopup();

        // Opcional pero recomendable: 
        // Si tu función añade EventListeners al objeto 'window' o 'document',
        // deberías retornar una función aquí para limpiarlos y evitar fugas de memoria.
  }, []);
  return (
    <BrowserRouter>
      <Login />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
