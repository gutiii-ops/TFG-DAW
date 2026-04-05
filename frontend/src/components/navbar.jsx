/* =======================================================================================================================
          navbar.jsx - Componente funcional que muestra la barra de navegación en la parte superior de la página
======================================================================================================================= */
// Import base de React
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// Import de estilos específicos para la barra de navegación
import '../styles/components/navbar.css'
// Import de iconos necesarios para la barra de navegación
import CartIcon from '../assets/icons/shopping-cart_icon.svg?react'

// Componente funcional que representa la barra de navegación
export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))

  useEffect(() => {
    // Escuchar cambios de autenticación locales o entre pestañas
    const handleAuthChange = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }

    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange) // Por si cambia en otra pestaña
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  const handleLoginClick = () => {
    document.dispatchEvent(new Event('openLoginModal'))
  }

  return (
    <nav>
      <a className='nav-logo' href='/'>
        <span>Gym</span>Mgmt
      </a>
      <ul className='nav-links'>
        <li>
          <a href='/'>Sobre Nosotros</a>
        </li>
        <li>
          <a href='/services'>Servicios</a>
        </li>
        <li>
          <a href='/store'>Tienda</a>
        </li>
        <li>
          <a href='/#contacto'>Contacto</a>
        </li>
      </ul>

      {isAuthenticated ? (
        <Link to='/user' className='nav-cta nav-user-link'>
          Mi Cuenta
        </Link>
      ) : (
        <button className='nav-cta' onClick={handleLoginClick}>
          Mi Cuenta
        </button>
      )}
      <button className='nav-cart'>
        <CartIcon className='nav-cart-icon' />
        <span className='nav-cart-badge'>0</span>
      </button>
    </nav>
  )
}
