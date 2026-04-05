/* =======================================================================================================================
                        App.jsx - Orquestador general para ejecutar los diferentes módulos de React
======================================================================================================================= */
// Import base de React
import React from 'react'
// Import de los módulos necesarios para el enrutamiento
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import de las páginas a mostrar
import Home from './pages/Public/home.jsx'
import StorePage from './pages/Public/store.jsx'
import ServicesPage from './pages/Public/services.jsx'
import UserHome from './pages/User/userHome.jsx'
import { Login } from './components/login.jsx'

// Componente principal de la aplicación que maneja el enrutamiento entre las diferentes páginas
function App() {
  return (
    <BrowserRouter>
      <Login />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/services' element={<ServicesPage />} />
        <Route path='/store' element={<StorePage />} />
        <Route path='/user' element={<UserHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
