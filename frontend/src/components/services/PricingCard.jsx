/* =======================================================================================================================
          PricingCard.jsx - Tarjeta de precio individual reutilizable para los planes de suscripción
======================================================================================================================= */
import React from 'react'
import '../../styles/components/services/PricingCard.css'

export const PricingCard = ({ tierName, price, features, isPopular }) => {
  return (
    <div className={`pricing-card ${isPopular ? 'popular-tier' : ''}`}>
      {isPopular && <div className="popular-badge">Más Elegido</div>}
      <div className="pricing-header">
        <h3>{tierName}</h3>
        <div className="price-container">
          <span className="price-symbol">€</span>
          <span className="price-amount">{price}</span>
          <span className="price-period">/ mes</span>
        </div>
      </div>
      <div className="pricing-body">
        <ul className="pricing-features">
          {features.map((feature, idx) => (
            <li key={idx}>
              <span className="check-icon">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="pricing-footer">
        <button className={`pricing-btn ${isPopular ? 'btn-primary' : 'btn-outline'}`}>
          Elegir Plan
        </button>
      </div>
    </div>
  )
}
