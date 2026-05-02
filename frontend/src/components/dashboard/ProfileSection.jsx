import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CustomDatePicker } from '../CustomDatePicker.jsx';
import { SelectField } from '../common/SelectField.jsx';
import { EU_COUNTRIES } from '../../utils/constants.js';
import { formatToDisplayDate, formatToISODate } from '../../utils/dateUtils.js';
import '../../styles/components/dashboard/ProfileSection.css';

const ProfileSection = ({ user: authUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para la edición
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchUserProfile();
  }, [authUser]);

  const fetchUserProfile = async () => {
    if (!authUser?.id) return;
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
      // Inicializamos el formData con los datos actuales (convirtiendo fecha)
      setFormData({
        ...data,
        user_date: formatToDisplayDate(data.user_date)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Si estamos cancelando, reseteamos el formData al valor actual de userData
      setFormData({
        ...userData,
        user_date: formatToDisplayDate(userData.user_date)
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('jwt_token');
      
      // Preparamos los datos convirtiendo la fecha de nuevo a ISO para el backend
      const dataToSave = {
        ...formData,
        user_date: formatToISODate(formData.user_date)
      };

      const response = await fetch(`http://localhost:8000/api/users/${authUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setIsEditing(false);
        addNotification('Perfil actualizado correctamente', 'success');
      } else {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }
    } catch (err) {
      addNotification(err.message, 'error');
    } finally {
      setIsSaving(false);
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

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-grid">
          <div className="profile-info-card">
            <h3>Información Personal</h3>
            <div className="info-group">
              <label>Nombre</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="user_name" 
                  value={formData.user_name || ''} 
                  onChange={handleChange}
                  className="profile-edit-input"
                  required
                />
              ) : (
                <p>{userData?.user_name}</p>
              )}
            </div>
            <div className="info-group">
              <label>Apellidos</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="user_surname" 
                  value={formData.user_surname || ''} 
                  onChange={handleChange}
                  className="profile-edit-input"
                />
              ) : (
                <p>{userData?.user_surname || 'No especificado'}</p>
              )}
            </div>
            <div className="info-group">
              <label>Email</label>
              <p className="readonly">{userData?.user_email}</p>
            </div>
            <div className="info-group">
              <label>Teléfono</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  name="user_phone" 
                  value={formData.user_phone || ''} 
                  onChange={handleChange}
                  className="profile-edit-input"
                />
              ) : (
                <p>{userData?.user_phone || 'No especificado'}</p>
              )}
            </div>
          </div>

          <div className="profile-info-card">
            <h3>Detalles de Cuenta</h3>
            <div className="info-group">
              <label>Documento de Identidad</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="user_IdDocument" 
                  value={formData.user_IdDocument || ''} 
                  onChange={handleChange}
                  className="profile-edit-input"
                />
              ) : (
                <p>{userData?.user_IdDocument || 'No verificado'}</p>
              )}
            </div>
            <div className="info-group">
              <label>País</label>
              {isEditing ? (
                <SelectField 
                  id="user_region"
                  name="user_region"
                  label="País"
                  value={formData.user_region || ''}
                  onChange={(e) => handleChange({ target: { name: 'user_region', value: e.target.value }})}
                  options={EU_COUNTRIES}
                />
              ) : (
                <p>{userData?.user_region || 'No especificado'}</p>
              )}
            </div>
            <div className="info-group">
              <label>Fecha de Nacimiento</label>
              {isEditing ? (
                <CustomDatePicker 
                  id="user_date"
                  label="Fecha Nacimiento"
                  value={formData.user_date || ''}
                  onChange={(e) => handleChange({ target: { name: 'user_date', value: e.target.value }})}
                />
              ) : (
                <p>{userData?.user_date ? new Date(userData.user_date).toLocaleDateString() : 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button type="button" className="cancel-profile-btn" onClick={handleEditToggle} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="save-profile-btn" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </>
          ) : (
            <button type="button" className="edit-profile-btn" onClick={handleEditToggle}>
              Editar Información
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
