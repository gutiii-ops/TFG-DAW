/* =======================================================================================================================
                        App.jsx - Orquestador general para ejecutar los diferentes módulos de React
======================================================================================================================= */
// Import base de React
import React from 'react'
// Import de los módulos necesarios para el enrutamiento
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationProvider.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute'
// Import de las páginas a mostrar
import Home from './pages/Public/home.jsx'
import StorePage from './pages/Public/store.jsx'
import ServicesPage from './pages/Public/services.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import { Login } from './components/login.jsx'
import CartDrawer from './components/store/CartDrawer.jsx'

// Import de estilos globales de notificaciones
import './styles/components/notification.css'

// Componente principal de la aplicación que maneja el enrutamiento entre las diferentes páginas
function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <AuthProvider>
          <BrowserRouter>
            <Login />
            <CartDrawer />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/services' element={<ServicesPage />} />
              <Route path='/store' element={<StorePage />} />
              
              {/* Ruta protegida que redirige al orquestador */}
              <Route 
                path='/dashboard/*' 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirección temporal de /user a /dashboard por retrocompatibilidad */}
              <Route path='/user' element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </NotificationProvider>
  )
}

export default App
