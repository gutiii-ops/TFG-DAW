/* =======================================================================================================================
                                  home.jsx - Página de inicio pública para todos los usuarios
======================================================================================================================= */

import React from 'react';
// Import de los componentes necesarios para la página
import { Navbar } from '../../components/navbar.jsx';
import { Footer } from '../../components/footer.jsx';

// Componente funcional que representa la página de inicio pública
const Home = () => {
  return (
    <header>
      <Navbar />
      <Footer />
    </header>
  );
};

export default Home;