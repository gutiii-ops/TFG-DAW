import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ConfirmationModal from './ConfirmationModal';
import SessionFormModal, { WEEK_DAYS } from './SessionFormModal';
import '../../styles/components/dashboard/CoachManagement.css';

// ─── Vista principal del coach ────────────────────────────────────────────────
const CoachManagementView = () => {
  const { token } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1);

  // Estado del formulario modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  // Estado del modal de confirmación de borrado
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sessionId: null, title: '' });

  const fetchSessions = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/coach/sessions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) setSessions(await res.json());
    } catch {
      addNotification('Error al cargar tus sesiones', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, addNotification]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // Normaliza el tiempo para el formulario (HH:MM)
  const normalizeTime = (t) => {
    if (!t) return '00:00';
    if (typeof t === 'string' && t.includes('T')) return t.split('T')[1].substring(0, 5);
    return String(t).substring(0, 5);
  };

  const handleOpenCreate = () => {
    setEditingSession(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (session) => {
    setEditingSession({
      ...session,
      start_time: normalizeTime(session.start_time),
      end_time: normalizeTime(session.end_time),
    });
    setFormOpen(true);
  };

  const handleSave = async (formData) => {
    if (!token) {
      addNotification('No estás autenticado. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    const isEdit = !!editingSession?.session_id;
    const url = isEdit
      ? `http://localhost:8000/api/coach/sessions/${editingSession.session_id}`
      : 'http://localhost:8000/api/coach/sessions';

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, day_of_week: Number(formData.day_of_week) }),
      });

      if (res.ok) {
        addNotification(isEdit ? 'Sesión actualizada' : 'Sesión creada con éxito', 'success');
        setFormOpen(false);
        fetchSessions();
      } else {
        const err = await res.json();
        addNotification(err.error || 'Error al guardar', 'error');
      }
    } catch {
      addNotification('Error de conexión', 'error');
    }
  };

  const handleDelete = async () => {
    if (!token) {
      addNotification('No estás autenticado. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/coach/sessions/${deleteModal.sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        addNotification('Sesión eliminada', 'success');
        fetchSessions();
      }
    } catch {
      addNotification('Error al eliminar', 'error');
    } finally {
      setDeleteModal({ isOpen: false, sessionId: null, title: '' });
    }
  };

  const filteredSessions = sessions.filter(s => Number(s.day_of_week) === Number(selectedDay));

  return (
    <div className="coach-mgmt-wrapper">
      {/* Cabecera */}
      <div className="coach-mgmt-header">
        <div>
          <h1>Mis Sesiones</h1>
          <p>Gestiona el horario de las clases que impartes.</p>
        </div>
        <button className="create-session-btn" onClick={handleOpenCreate}>
          + Nueva Sesión
        </button>
      </div>

      {/* Selector de días */}
      <div className="coach-days-selector">
        {WEEK_DAYS.map(day => (
          <button
            key={day.id}
            className={`coach-day-btn ${selectedDay === day.id ? 'is-active' : ''}`}
            onClick={() => setSelectedDay(day.id)}
          >
            {day.name.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Lista de sesiones */}
      <div className="coach-sessions-list">
        {loading ? (
          <div className="coach-loading">Cargando tus sesiones...</div>
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <div key={session.session_id} className="coach-session-card">
              <div className="cscard-time">
                <span>{normalizeTime(session.start_time)}</span>
                <span className="cscard-time-sep">—</span>
                <span>{normalizeTime(session.end_time)}</span>
              </div>
              <div className="cscard-info">
                <div className="cscard-title">
                  {session.title}
                  <span className={`cscard-badge ${session.is_coaching ? 'personal' : 'grupal'}`}>
                    {session.is_coaching ? 'Personal' : 'Grupal'}
                  </span>
                  {session.category && (
                    <span className="cscard-category">{session.category}</span>
                  )}
                </div>
                {session.description && (
                  <p className="cscard-desc">{session.description}</p>
                )}
              </div>
              <div className="cscard-actions">
                <button className="cscard-btn edit" onClick={() => handleOpenEdit(session)}>
                  Editar
                </button>
                <button
                  className="cscard-btn delete"
                  onClick={() => setDeleteModal({ isOpen: true, sessionId: session.session_id, title: session.title })}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="coach-empty">
            <div className="coach-empty-icon">📅</div>
            <h3>Sin sesiones este día</h3>
            <p>No tienes clases programadas. Crea una nueva sesión con el botón de arriba.</p>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      <SessionFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editingSession}
      />

      {/* Modal de confirmación de borrado */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Eliminar Sesión"
        message={`¿Estás seguro de que quieres eliminar "${deleteModal.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, sessionId: null, title: '' })}
        confirmText="Eliminar Sesión"
      />
    </div>
  );
};

export default CoachManagementView;
