import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/components/dashboard/MembershipSection.css';

const MembershipSection = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchSubscription();
  }, []);

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

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/subscriptions/cancel/${subscription.subscription_id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        addNotification("Renovación cancelada con éxito", "success");
        setShowCancelModal(false);
        fetchSubscription(); // Recargar estado
      } else {
        addNotification("Error al cancelar la suscripción", "error");
      }
    } catch (error) {
      console.error("Error al cancelar:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Cálculo del progreso de la barra
  const calculateProgress = () => {
    if (!subscription) return 0;
    const start = new Date(subscription.start_date).getTime();
    const end = new Date(subscription.end_date).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="section-loader-container">
        <div className="minimal-spinner"></div>
        <p>Cargando detalles de tu plan...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="membership-empty-state">
        <div className="empty-icon">🎖️</div>
        <h2>No tienes una membresía activa</h2>
        <p>Suscríbete a uno de nuestros planes para disfrutar de acceso ilimitado al gimnasio y clases exclusivas.</p>
        <button className="primary-cta-btn" onClick={() => window.location.href='/services'}>
          Explorar Planes
        </button>
      </div>
    );
  }

  return (
    <div className="membership-b-wrapper">
      {/* CABECERA LINEAL */}
      <div className="membership-b-header">
        <div className="plan-main-info">
          <span className="plan-label">Plan Actual</span>
          <h1>{subscription.plan_name}</h1>
        </div>
        <div className={`status-badge-custom ${subscription.subscription_status ? 'active' : 'cancelled'}`}>
          {subscription.subscription_status ? '● Activa' : '● Finaliza pronto'}
        </div>
      </div>

      {/* BARRA DE PROGRESO */}
      <div className="membership-progress-block">
        <div className="progress-labels">
          <span>Iniciado: {new Date(subscription.start_date).toLocaleDateString()}</span>
          <span>Vence: {new Date(subscription.end_date).toLocaleDateString()}</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
        <p className="days-left-text">
          Quedan aproximadamente {Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))} días de acceso.
        </p>
      </div>

      {/* DETALLES EN LISTA */}
      <div className="membership-info-list">
        <div className="info-row">
          <span className="info-icon">💳</span>
          <div className="info-content">
            <span className="info-label">Precio de suscripción</span>
            <span className="info-value">{subscription.plan_price}€ / mes</span>
          </div>
        </div>
        <div className="info-row">
          <span className="info-icon">📅</span>
          <div className="info-content">
            <span className="info-label">Próxima renovación</span>
            <span className="info-value">{new Date(subscription.end_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="membership-actions-footer">
        {subscription.subscription_status ? (
          <button className="cancel-membership-btn" onClick={() => setShowCancelModal(true)}>
            Cancelar Renovación
          </button>
        ) : (
          <div className="cancellation-notice">
            La renovación automática está desactivada. Tu acceso finalizará el {new Date(subscription.end_date).toLocaleDateString()}.
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN (INLINE) */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="confirm-modal-box">
            <h3>¿Confirmar cancelación?</h3>
            <p>Seguirás teniendo acceso a todas las instalaciones hasta el <strong>{new Date(subscription.end_date).toLocaleDateString()}</strong>. Después de esta fecha, tu acceso será restringido.</p>
            <div className="modal-actions">
              <button className="btn-back" onClick={() => setShowCancelModal(false)} disabled={isCancelling}>
                Volver atrás
              </button>
              <button className="btn-confirm-cancel" onClick={handleCancelSubscription} disabled={isCancelling}>
                {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipSection;
