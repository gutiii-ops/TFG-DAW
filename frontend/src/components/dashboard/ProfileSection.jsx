import React, { useState, useEffect } from 'react';

const ProfileSection = ({ user: authUser }) => {
  const [userData, setUserData] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        
        // Cargar Perfil
        const userRes = await fetch(`http://localhost:8000/api/users/${authUser.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await userRes.json();
        setUserData(profileData);

        // Cargar Suscripción
        const subRes = await fetch(`http://localhost:8000/api/subscriptions/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const subData = await subRes.json();
        if (subData.subscription_id) setSubscription(subData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchData();
    }
  }, [authUser]);

  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu suscripción? Mantendrás el acceso hasta el final del periodo.')) return;
    
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/subscriptions/cancel/${subscription.subscription_id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Suscripción cancelada correctamente');
        window.location.reload();
      }
    } catch (err) {
      alert('Error al cancelar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="minimal-spinner"></div>
        <p>Cargando tus datos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="empty-state">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {userData?.user_name?.[0] || 'U'}
        </div>
        <div className="profile-title-block">
          <h2>{userData?.user_name} {userData?.user_surname}</h2>
          <span className="profile-role-tag">{userData?.role || 'Miembro'}</span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-info-card">
          <h3>Información Personal</h3>
          <div className="info-group">
            <label>Nombre Completo</label>
            <p>{userData?.user_name} {userData?.user_surname || 'No especificado'}</p>
          </div>
          <div className="info-group">
            <label>Email</label>
            <p>{userData?.user_email}</p>
          </div>
          <div className="info-group">
            <label>Teléfono</label>
            <p>{userData?.user_phone || 'No especificado'}</p>
          </div>
        </div>

        <div className="profile-info-card">
          <h3>Detalles de Cuenta</h3>
          <div className="info-group">
            <label>Documento de Identidad</label>
            <p>{userData?.user_IdDocument || 'No verificado'}</p>
          </div>
          <div className="info-group">
            <label>Región / Ciudad</label>
            <p>{userData?.user_region || 'No especificada'}</p>
          </div>
          <div className="info-group">
            <label>Fecha de Registro</label>
            <p>{userData?.user_date ? new Date(userData.user_date).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="profile-info-card membership-card">
          <h3>Tu Membresía</h3>
          {subscription ? (
            <>
              <div className="info-group">
                <label>Plan Actual</label>
                <p className="plan-name-highlight">{subscription.plan_name}</p>
              </div>
              <div className="info-group">
                <label>Vence el</label>
                <p>{new Date(subscription.end_date).toLocaleDateString()}</p>
              </div>
              <div className="info-group">
                <label>Estado</label>
                <span className={`status-badge ${subscription.subscription_status ? 'active' : 'cancelled'}`}>
                  {subscription.subscription_status ? 'Activa' : 'Cancelada (Pendiente de cierre)'}
                </span>
              </div>
              {subscription.subscription_status && (
                <button className="cancel-sub-link" onClick={handleCancelSubscription}>
                  Cancelar renovación
                </button>
              )}
            </>
          ) : (
            <div className="no-membership">
              <p>No tienes ningún plan activo.</p>
              <button className="get-plan-btn" onClick={() => window.location.href='/servicios'}>
                Ver Planes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-profile-btn" onClick={() => alert('Próximamente: Editar Perfil')}>
          Editar Información
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
