/* =======================================================================================================================
          navbar.jsx - Componente funcional que muestra la barra de navegación en la parte superior de la página
======================================================================================================================= */
// Import base de React
import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
// Import de estilos específicos para la barra de navegación
import '../styles/components/navbar.css'
// Import de iconos necesarios para la barra de navegación
import CartIcon from '../assets/icons/shopping-cart_icon.svg?react'
import { CartContext } from '../context/CartContext'

// Componente funcional que representa la barra de navegación
export const Navbar = () => {
  const { isAuthenticated, logout, role } = useContext(AuthContext)
  const { cartCount, setIsCartOpen } = useContext(CartContext)
  const location = useLocation()
  const navigate = useNavigate()

  const isDashboard = location.pathname.startsWith('/dashboard')

  const handleLoginClick = () => {
    document.dispatchEvent(new Event('openLoginModal'))
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav>
      <Link className='nav-logo' to={isDashboard ? '/dashboard' : '/'}>
        <span>Gym</span>Mgmt
      </Link>
      
      {!isDashboard ? (
        <ul className='nav-links'>
          <li>
            <Link to='/'>Sobre Nosotros</Link>
          </li>
          <li>
            <Link to='/services'>Servicios</Link>
          </li>
          <li>
            <Link to='/store'>Tienda</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to='/panel'>Perfil</Link>
            </li>
          )}
          <li>
            <a href='/#contacto'>Contacto</a>
          </li>
        </ul>
      ) : (
        <ul className='nav-links'>
          <li>
            <span style={{ color: 'var(--muted)', fontWeight: 'bold' }}>PANEL DE {role?.toUpperCase()}</span>
          </li>
        </ul>
      )}

      {isAuthenticated ? (
        <button className='nav-cta nav-logout' onClick={handleLogout}>
          Cerrar Sesión
        </button>
      ) : (
        <button className='nav-cta' onClick={handleLoginClick}>
          Mi Cuenta
        </button>
      )}
      
      {!isDashboard && (
        <button className='nav-cart' onClick={() => setIsCartOpen(true)}>
          <CartIcon className='nav-cart-icon' />
          {cartCount > 0 && <span className='nav-cart-badge'>{cartCount}</span>}
        </button>
      )}
    </nav>
  )
}
