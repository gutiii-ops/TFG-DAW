import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { DashboardNavContext } from '../context/DashboardNavContext'
import '../styles/components/navbar.css'
import CartIcon from '../assets/icons/shopping-cart_icon.svg?react'
import { CartContext } from '../context/CartContext'

// Definición de secciones del panel (filtradas por rol en el menú)
const DASHBOARD_SECTIONS = [
  { id: 'overview',       label: 'Resumen',    roles: ['User', 'Admin', 'Coach'] },
  { id: 'profile',        label: 'Mi Perfil',  roles: ['User', 'Admin', 'Coach'] },
  { id: 'coaching',       label: 'Coaching',   roles: ['User', 'Coach'] },
  { id: 'orders',         label: 'Mis Compras',roles: ['User', 'Admin', 'Coach'] },
  { id: 'subscriptions',  label: 'Membresía',  roles: ['User'] },
  { id: 'support',        label: 'Soporte',    roles: ['User', 'Coach'] },
];

export const Navbar = () => {
  const { isAuthenticated, logout, role } = useContext(AuthContext)
  const { cartCount, setIsCartOpen } = useContext(CartContext)
  // El contexto del dashboard puede ser null si no estamos en el panel
  const dashCtx = useContext(DashboardNavContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isDashboard = location.pathname.startsWith('/panel')

  useEffect(() => {
    setIsMenuOpen(false)
    document.body.classList.remove('menu-is-open')
  }, [location])

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', isMenuOpen)
    return () => document.body.classList.remove('menu-is-open')
  }, [isMenuOpen])

  const handleLoginClick = () => {
    document.dispatchEvent(new Event('openLoginModal'))
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const handleDashboardNav = (sectionId) => {
    if (dashCtx) dashCtx.setActiveSection(sectionId)
    setIsMenuOpen(false)
  }

  // Secciones del panel filtradas por rol del usuario
  const visibleSections = DASHBOARD_SECTIONS.filter(s => s.roles.includes(role || 'User'))

  return (
    <>
      {/* ── BARRA SUPERIOR ─ siempre igual en escritorio ── */}
      <nav>
        <Link className='nav-logo' to={isDashboard ? '/panel' : '/'}>
          <span>Gym</span>Mgmt
        </Link>

        {/* Links de escritorio */}
        <ul className='nav-links nav-links--desktop'>
          <li><Link to='/'>Inicio</Link></li>
          <li><Link to='/services'>Servicios</Link></li>
          <li><Link to='/store'>Tienda</Link></li>
          {isAuthenticated && <li><Link to='/panel'>Mi Panel</Link></li>}
          <li><a href='/#contacto'>Contacto</a></li>
        </ul>

        {/* Acciones de escritorio */}
        <div className="nav-actions-desktop">
          {isAuthenticated ? (
            <button className='nav-cta nav-logout' onClick={handleLogout}>Cerrar Sesión</button>
          ) : (
            <button className='nav-cta' onClick={handleLoginClick}>Mi Cuenta</button>
          )}
          {!isDashboard && (
            <button className='nav-cart' onClick={() => setIsCartOpen(true)}>
              <CartIcon className='nav-cart-icon' />
              {cartCount > 0 && <span className='nav-cart-badge'>{cartCount}</span>}
            </button>
          )}
        </div>

        {/* Hamburguesa (solo en móvil) */}
        <button
          className={`nav-hamburger ${isMenuOpen ? 'is-active' : ''}`}
          onClick={() => setIsMenuOpen(v => !v)}
          aria-label="Abrir menú"
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* ── OVERLAY MÓVIL ── */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'is-open' : ''}`}>
        <nav className="mobile-menu-nav">

          {isDashboard ? (
            /* ── VISTA PANEL: misma estructura de links que la web ── */
            <>
              <p className="mobile-menu-section-title">Mi Panel</p>
              <ul>
                {visibleSections.map(s => (
                  <li key={s.id}>
                    <button
                      className={`mobile-dash-link ${dashCtx?.activeSection === s.id ? 'is-active' : ''}`}
                      onClick={() => handleDashboardNav(s.id)}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
                <li className="mobile-menu-separator-item">
                  <Link to='/' onClick={() => setIsMenuOpen(false)}>← Volver a la Web</Link>
                </li>
              </ul>
            </>
          ) : (
            /* ── VISTA WEB: links normales ── */
            <ul>
              <li><Link to='/' onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
              <li><Link to='/services' onClick={() => setIsMenuOpen(false)}>Servicios</Link></li>
              <li><Link to='/store' onClick={() => setIsMenuOpen(false)}>Tienda</Link></li>
              {isAuthenticated && <li><Link to='/panel' onClick={() => setIsMenuOpen(false)}>Mi Panel</Link></li>}
              <li><a href='/#contacto' onClick={() => setIsMenuOpen(false)}>Contacto</a></li>
            </ul>
          )}

          <div className="mobile-menu-action">
            {isAuthenticated ? (
              <button className='nav-cta nav-logout' onClick={handleLogout}>Cerrar Sesión</button>
            ) : (
              <button className='nav-cta' onClick={handleLoginClick}>Mi Cuenta</button>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
