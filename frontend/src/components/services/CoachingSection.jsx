/* =======================================================================================================================
          CoachingSection.jsx - Módulo para presentar el servicio de Coaching Personal
======================================================================================================================= */
import React from 'react'
import '../../styles/components/services/CoachingSection.css'

export const CoachingSection = () => {
  return (
    <section className='coaching-section'>
      <div className='coaching-container'>
        <div className='coaching-content'>
          <div className='coaching-badge'>Servicio Premium</div>
          <h2>
            Transforma tu cuerpo con un{' '}
            <span className='highlight-text'>Coach Personal</span>
          </h2>
          <p className='coaching-desc'>
            No entrenes a ciegas. Nuestro equipo de entrenadores certificados
            diseñará un programa específico adaptado a tu metabolismo, horarios
            y objetivos. Tanto si buscas hipertrofia, pérdida de peso o
            recuperación de lesiones, estamos contigo en cada repetición.
          </p>

          <ul className='coaching-benefits'>
            <li>
              <span className='benefit-icon'>🎯</span>
              <div>
                <strong>Planificación a medida</strong>
                <p>Rutinas actualizadas semanalmente según tu progreso.</p>
              </div>
            </li>
            <li>
              <span className='benefit-icon'>🥗</span>
              <div>
                <strong>Asesoramiento nutricional</strong>
                <p>Macros calculados y menús adaptados a tus gustos.</p>
              </div>
            </li>
            <li>
              <span className='benefit-icon'>📈</span>
              <div>
                <strong>Seguimiento 24/7</strong>
                <p>
                  Contacto directo vía WhatsApp para dudas y correcciones
                  técnicas.
                </p>
              </div>
            </li>
          </ul>

          <div className='coaching-cta'>
            <a className='coaching-cta-btn' href='/#contacto'>
              Solicitar Asesoria Gratis
            </a>
            <p className='cta-note'>
              *Plazas limitadas según disponibilidad del coach
            </p>
          </div>
        </div>

        <div className='coaching-visual'>
          <div className='glow-effect'></div>
          {/* Usamos un div con imagen de fondo en CSS para el arte gráfico */}
          <div className='coaching-image'>
            <div className='stats-card float-anim-1'>
              <span className='stat-value'>+300</span>
              <span className='stat-label'>Transformaciones</span>
            </div>
            <div className='stats-card float-anim-2'>
              <span className='stat-value'>100%</span>
              <span className='stat-label'>Personalizado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
