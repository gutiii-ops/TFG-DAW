/* =======================================================================================================================
          PricingCard.jsx - Tarjeta de precio individual reutilizable para los planes de suscripción
======================================================================================================================= */
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import '../../styles/components/services/PricingCard.css'

export const PricingCard = ({ planId, tierName, price, features, isPopular }) => {
  const { user, login } = useContext(AuthContext); // Asumimos que login abre el modal si no hay user
  const { showNotification } = useNotification();

  const handleSubscribe = async () => {
    if (!user) {
      showNotification('Debes iniciar sesión para suscribirte', 'info');
      // Aquí podrías disparar el evento para abrir el login si tienes un gestor global
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:8000/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al procesar la suscripción');
      }

      showNotification(`¡Bienvenido al plan ${tierName}! Suscripción activada.`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
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
          onClick={handleSubscribe}
        >
          Elegir Plan
        </button>
      </div>
    </div>
  )
}
