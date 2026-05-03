/* =======================================================================================================================
          UserHeader.jsx - Componente funcional para el encabezado de bienvenida del usuario
======================================================================================================================= */
// Import base de React
import React from 'react'
// Import de la hoja de estilos específica para el header del usuario
import '../../styles/components/user/UserHeader.css'
import { useNavigate } from 'react-router-dom'

// Componente que muestra el saludo al usuario logueado y el acceso rápido al panel de ayuda
export const UserHeader = ({ userData, setShowHelpModal }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    // Refrescar el estado global de autenticación escuchando el evento originado
    window.dispatchEvent(new Event('auth-change'))
    // Redirigir al usuario al Home de nuevo
    navigate('/')
  }

  return (
    <section className='user-header'>
      <div className='user-header-content'>
        <div className='user-greeting'>
          <h1>Bienvenido, {userData?.name?.split(' ')[0] || 'Usuario'}</h1>
          <p>Gestiona tu perfil, reservas y pedidos en un solo lugar</p>
        </div>
        <div className='user-actions-btn'>
          <button
            className='logout-button'
            onClick={handleLogout}
            title="Cerrar la sesión de forma segura"
          >
            Cerrar Sesión
          </button>
          <button
            className='help-button'
            onClick={() => setShowHelpModal(true)}
          >
            ¿Necesitas ayuda?
          </button>
        </div>
      </div>
    </section>
  )
}
