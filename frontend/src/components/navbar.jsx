/* =======================================================================================================================
          navbar.jsx - Componente funcional que muestra la barra de navegación en la parte superior de la página
======================================================================================================================= */
// Import base de React
import React from 'react';
// Import de estilos específicos para la barra de navegación
import '../styles/components/navbar.css';
// Import de iconos necesarios para la barra de navegación
import CartIcon from '../assets/icons/shopping-cart_icon.svg?react';

// Componente funcional que representa la barra de navegación
export const Navbar = () => {
  return (
    <nav>
      <a className="nav-logo" href="/"><span>Gym</span>BooSTR</a>
      <ul className="nav-links">
        <li><a href="">Sobre Nosotros</a></li>
        <li><a href="">Tienda</a></li>
        <li><a href="">Reservas</a></li>
        <li><a href="">Contacto</a></li>
      </ul>
      <button className="nav-cta" href="">Log In</button>
      <button className="nav-cart" href="">
        <CartIcon className="nav-cart-icon"/>
        <span className="nav-cart-badge">0</span>
      </button>
    </nav>
  );
};