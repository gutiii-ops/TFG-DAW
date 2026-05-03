/* =======================================================================================================================
          services.jsx - Página pública que muestra los planes de suscripción y el coaching personal
======================================================================================================================= */
import React from 'react'
import { Navbar } from '../../components/navbar.jsx'
import { Footer } from '../../components/footer.jsx'

// Import de las secciones modulares de servicios
import { SubscriptionsSection } from '../../components/services/SubscriptionsSection.jsx'
import { CoachingSection } from '../../components/services/CoachingSection.jsx'

// Import de CSS local para ajuste de padding
import '../../styles/pages/services.css'

const ServicesPage = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="services-page-main">
        <SubscriptionsSection />
        <CoachingSection />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default ServicesPage
