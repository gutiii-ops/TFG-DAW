/* =======================================================================================================================
                                  home.jsx - Página de inicio pública para todos los usuarios
======================================================================================================================= */

import React, { useEffect } from 'react'
// Import de los componentes necesarios para la página
import { Navbar } from '../../components/navbar.jsx'
import { Footer } from '../../components/footer.jsx'
import Intro from '../../components/intro.jsx'
import ContactSection from '../../components/ContactSection.jsx'
import { Login } from '../../components/login.jsx'

// Componente funcional que representa la página de inicio pública
const Home = () => {
  useEffect(() => {
    if (window.location.hash === '#contacto') {
      setTimeout(() => {
        const section = document.getElementById('contacto')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }, [])

  return (
    <>

      <header>
        <Navbar />
      </header>
      <main>
        <Intro />
        <ContactSection />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default Home
