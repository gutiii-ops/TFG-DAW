import React, { useState } from 'react';

const NewTicketModal = ({ onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    onSubmit(subject, message);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="support-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Ticket</h2>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asunto / Título</label>
            <input 
              type="text" 
              placeholder="Ej: Problema con el acceso a la tienda" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Mensaje Detallado</label>
            <textarea 
              placeholder="Explícanos tu problema con detalle..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="submit-ticket-btn">Abrir Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;
