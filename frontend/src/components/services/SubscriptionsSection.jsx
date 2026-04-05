/* =======================================================================================================================
          SubscriptionsSection.jsx - Módulo encargado de gestionar y renderizar el catálogo de planes de gimnasio
======================================================================================================================= */
import React from 'react'
import { PricingCard } from './PricingCard.jsx'
import '../../styles/components/services/SubscriptionsSection.css'

export const SubscriptionsSection = () => {
  // Matriz de datos paramétrica de los planes, siguiendo las reglas DRY (sin repetir código JSX)
  const plansData = [
    {
      tierName: 'Basic',
      price: '29',
      features: [
        'Acceso completo a la sala de musculación',
        'Zonas cardio y estiramientos',
        'Vestuario y duchas estándar',
        'Mátricula gratuita'
      ],
      isPopular: false
    },
    {
      tierName: 'Fitness',
      price: '49',
      features: [
        'Todo lo del plan Basic',
        'Clases dirigidas ilimitadas (Yoga, CrossFit...)',
        'App de seguimiento y rutinas',
        'Toalla y taquilla diaria'
      ],
      isPopular: true
    },
    {
      tierName: 'Premium',
      price: '89',
      features: [
        'Todo lo del plan Fitness',
        '1 sesión de coaching personal al mes',
        'Fisioterapia y masajes (1 vez/mes)',
        'Suplemento pre/post entreno incluido',
        'Acceso a zona VIP'
      ],
      isPopular: false
    }
  ]

  return (
    <section className="subscriptions-section">
      <div className="subscriptions-header">
        <h2>Planes de <span className="highlight">Suscripción</span></h2>
        <p>Elige el nivel de entrenamiento que mejor se adapte a tus objetivos. Cancela cuando quieras.</p>
      </div>
      
      <div className="pricing-grid">
        {plansData.map((plan, index) => (
          <PricingCard 
            key={index}
            tierName={plan.tierName}
            price={plan.price}
            features={plan.features}
            isPopular={plan.isPopular}
          />
        ))}
      </div>
    </section>
  )
}
