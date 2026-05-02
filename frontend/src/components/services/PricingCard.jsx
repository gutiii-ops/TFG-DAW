/* =======================================================================================================================
          PricingCard.jsx - Tarjeta de precio individual reutilizable para los planes de suscripción
======================================================================================================================= */
import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import '../../styles/components/services/PricingCard.css'

export const PricingCard = ({ planId, tierName, price, features, isPopular }) => {
  const { addPlanToCart } = useContext(CartContext);

  const handleSelectPlan = () => {
    addPlanToCart({
      id: planId,
      name: `Plan ${tierName}`,
      price: parseFloat(price),
      image: null, // Podríamos poner un icono de membresía
    });
  };

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
        <button 
          className={`pricing-btn ${isPopular ? 'btn-primary' : 'btn-outline'}`}
          onClick={handleSelectPlan}
        >
          Elegir Plan
        </button>
      </div>
    </div>
  )
}
