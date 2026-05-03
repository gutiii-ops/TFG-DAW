/* =======================================================================================================================
          SubscriptionsSection.jsx - Módulo encargado de gestionar y renderizar el catálogo de planes de gimnasio
======================================================================================================================= */
import React, { useState, useEffect } from 'react'
import { PricingCard } from './PricingCard.jsx'
import '../../styles/components/services/SubscriptionsSection.css'

export const SubscriptionsSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/plans');
        if (!response.ok) throw new Error('Error al cargar planes');
        const data = await response.json();
        
        // Mapeamos los datos de la DB al formato que espera PricingCard
        const formattedPlans = data.map(p => ({
          id: p.plan_id,
          tierName: p.plan_name,
          price: p.plan_price,
          // Split de descripción por comas para sacar las features si se guardan así
          features: p.plan_description.split('+').map(f => f.trim()),
          isPopular: p.plan_name === 'Fitness' // Marcamos Fitness como popular por defecto
        }));

        setPlans(formattedPlans);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <div className="loader-container"><div className="minimal-spinner"></div></div>;

  return (
    <section className="subscriptions-section">
      <div className="subscriptions-header">
        <h2>Planes de <span className="highlight">Suscripción</span></h2>
        <p>Elige el nivel de entrenamiento que mejor se adapte a tus objetivos. Cancela cuando quieras.</p>
      </div>
      
      <div className="pricing-grid">
        {plans.map((plan) => (
          <PricingCard 
            key={plan.id}
            planId={plan.id}
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
