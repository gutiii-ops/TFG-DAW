/* =======================================================================================================================
          navbar.jsx - Componente funcional que muestra la barra de navegación en la parte superior de la página
======================================================================================================================= */
// Import base de React
import React from 'react';
// Import de estilos específicos para la barra de navegación
import '../styles/components/navbar.css';

// Componente funcional que representa la barra de navegación
export const Navbar = () => {
  return (
    <nav>
      <a class="nav-logo" href="#"><span>Gym</span>BooSTR</a>
      <section class="nav-links">
        <a>Sobre Nosotros</a>
        <a>Nutrición</a>
        <a>Reservas</a>
        <a>Contacto</a>
      </section>
      <a class="nav-cta">Log In</a>
    </nav>
  );
};

export default Navbar;