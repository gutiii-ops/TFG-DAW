/* =======================================================================================================================
          UserProfile.jsx - Componente funcional para la visualización y edición del perfil del usuario
======================================================================================================================= */
import React from 'react'
import '../../styles/components/user/UserProfile.css'

export const UserProfile = ({
  userData,
  editForm,
  isEditingProfile,
  savingProfile,
  handleInputChange,
  handleProfileEdit,
  handleProfileSave,
  setIsEditingProfile
}) => {
  return (
    <section className='tab-content profile-content'>
      <div className='profile-card'>
        <div className='profile-header'>
          <h2>Mi Información Personal</h2>
          {!isEditingProfile && (
            <button className='edit-button' onClick={handleProfileEdit}>
              Editar
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form className='profile-form'>
            <div className='form-group'>
              <label htmlFor='name'>Nombre completo</label>
              <input
                id='name'
                type='text'
                name='name'
                value={editForm?.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Correo electrónico</label>
              <input
                id='email'
                type='email'
                name='email'
                value={editForm?.email || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>Teléfono</label>
              <input
                id='phone'
                type='tel'
                name='phone'
                value={editForm?.phone || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-buttons'>
              <button
                type='button'
                className='btn-save'
                onClick={handleProfileSave}
                disabled={savingProfile}
              >
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type='button'
                className='btn-cancel'
                onClick={() => setIsEditingProfile(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className='profile-info'>
            <div className='info-item'>
              <span className='info-label'>Nombre</span>
              <span className='info-value'>{userData?.name}</span>
            </div>
            <div className='info-item'>
              <span className='info-label'>Correo</span>
              <span className='info-value'>{userData?.email}</span>
            </div>
            <div className='info-item'>
              <span className='info-label'>Teléfono</span>
              <span className='info-value'>{userData?.phone}</span>
            </div>
            <div className='info-item'>
              <span className='info-label'>Miembro desde</span>
              <span className='info-value'>
                {userData?.memberSince 
                  ? new Date(userData.memberSince).toLocaleDateString('es-ES')
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
