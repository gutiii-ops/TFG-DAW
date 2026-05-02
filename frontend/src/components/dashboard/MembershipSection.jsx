import React, { useState, useEffect } from 'react';
import '../../styles/components/dashboard/MembershipSection.css';

const MembershipSection = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('http://localhost:8000/api/subscriptions/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.subscription_id) setSubscription(data);
      } catch (error) {
        console.error("Error al cargar membresía:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return <div className="section-loader">Cargando membresía...</div>;
  }

  return (
    <div className="membership-section-wrapper">
      <div className="membership-hero-card">
        <div className="hero-content">
          <span className="status-pill">Suscripción {subscription?.subscription_status ? 'Activa' : 'Inactiva'}</span>
          <h1>{subscription?.plan_name || 'Sin Plan Activo'}</h1>
          <p className="expiration-text">
            {subscription 
              ? `Tu membresía vence el ${new Date(subscription.end_date).toLocaleDateString()}`
              : 'Suscríbete ahora para desbloquear todos los beneficios.'}
          </p>
        </div>
        <div className="hero-visual">
          <div className="glowing-orb"></div>
        </div>
      </div>

      <div className="membership-details-grid">
        <div className="benefit-card">
          <div className="benefit-icon">🏋️</div>
          <h3>Acceso Total</h3>
          <p>Entrada ilimitada a todas nuestras instalaciones y zonas de cardio.</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">📅</div>
          <h3>Clases Dirigidas</h3>
          <p>Reserva tu lugar en cualquier clase colectiva (Yoga, HIIT, Spinning).</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">📱</div>
          <h3>App Premium</h3>
          <p>Acceso a rutinas personalizadas y seguimiento de progreso en tiempo real.</p>
        </div>
      </div>

      {!subscription && (
        <div className="upsell-block">
          <h2>¿Listo para empezar tu transformación?</h2>
          <button className="upgrade-cta-btn" onClick={() => window.location.href='/servicios'}>
            Ver Planes de Suscripción
          </button>
        </div>
      )}

      {subscription && subscription.subscription_status && (
        <div className="management-block">
          <h3>Gestión de Cuenta</h3>
          <div className="management-actions">
            <button className="secondary-action-btn">Descargar Facturas</button>
            <button className="danger-action-btn">Cancelar Suscripción</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipSection;
