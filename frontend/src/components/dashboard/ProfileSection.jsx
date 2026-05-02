import React, { useState, useEffect } from 'react';

const ProfileSection = ({ user: authUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`http://localhost:8000/api/users/${authUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('No se pudo cargar el perfil');

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchUserProfile();
    }
  }, [authUser]);

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
            <label>Fecha de Nacimiento</label>
            <p>{userData?.user_date ? new Date(userData.user_date).toLocaleDateString() : 'N/A'}</p>
          </div>
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
