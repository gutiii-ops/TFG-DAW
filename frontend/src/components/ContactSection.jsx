import React from 'react'
import '../styles/components/ContactSection.css'

const ContactSection = () => {
  return (
    <section id='contacto' className='contact-section'>
      <div className='contact-section-inner'>
        <span className='contact-label'>Sobre Nosotros</span>
        <h2>Contacto directo para tienda y servicios</h2>
        <p className='contact-description'>
          Si tienes preguntas sobre nuestros productos, planes de entrenamiento
          o asesorías, escríbenos y te responderemos rápido. Nuestro equipo está
          disponible para ayudarte con tu rutina, tus compras y tu progreso.
        </p>

        <div className='contact-grid'>
          <article className='contact-card'>
            <h3>Correo</h3>
            <p>contacto@gymmgmt.com</p>
          </article>
          <article className='contact-card'>
            <h3>Teléfono</h3>
            <p>+34 900 123 456</p>
          </article>
          <article className='contact-card'>
            <h3>Ubicación</h3>
            <p>Calle Deportiva 12, Madrid</p>
          </article>
          <article className='contact-card'>
            <h3>Horario</h3>
            <p>Lunes a Domingo · 6:00 - 23:00</p>
          </article>
        </div>

        <div className='contact-actions'>
          <a className='btn-primary' href='mailto:contacto@gymmgmt.com'>
            Enviar correo
          </a>
          <a className='btn-outline' href='tel:+34900123456'>
            Llamar ahora
          </a>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
