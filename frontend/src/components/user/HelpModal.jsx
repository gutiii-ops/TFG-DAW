/* =======================================================================================================================
          HelpModal.jsx - Componente funcional flotante para dar soporte a los usuarios
======================================================================================================================= */
// Import base de React y hooks
import React, { useState } from 'react'
// Import de la hoja de estilos específica para la ayuda
import '../../styles/components/user/HelpModal.css'

// Modal renderizado por encima de todo el contenido al solicitar ayuda interactiva
export const HelpModal = ({ setShowHelpModal }) => {
  // Estado local para definir qué modalidad de asistente se ha clicado (ia, coach, null)
  const [selectedHelpType, setSelectedHelpType] = useState(null)

  return (
    <div
      className='help-modal-overlay'
      onClick={() => setShowHelpModal(false)}
    >
      <div
        className='help-modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='modal-close-btn'
          onClick={() => setShowHelpModal(false)}
        >
          ✕
        </button>
        <h2>¿Cómo podemos ayudarte?</h2>
        <p>Selecciona el tipo de asistencia que necesitas:</p>
        <div className='help-options'>
          <button
            className={`help-option ${selectedHelpType === 'ia' ? 'selected' : ''}`}
            onClick={() => setSelectedHelpType('ia')}
          >
            <span className='help-icon'>🤖</span>
            <span className='help-text'>Asistente IA</span>
            <span className='help-desc'>
              Respuestas rápidas y automáticas
            </span>
          </button>
          <button
            className={`help-option ${selectedHelpType === 'coach' ? 'selected' : ''}`}
            onClick={() => setSelectedHelpType('coach')}
          >
            <span className='help-icon'>👨‍🏫</span>
            <span className='help-text'>Coach Personal</span>
            <span className='help-desc'>
              Contacta con nuestros entrenadores
            </span>
          </button>
        </div>
        {selectedHelpType && (
          <div className='help-form'>
            <textarea
              placeholder='Cuéntanos tu duda o problema...'
              rows='5'
              className='help-textarea'
            ></textarea>
            <button className='btn-send-help'>Enviar solicitud</button>
          </div>
        )}
      </div>
    </div>
  )
}
