import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ConfirmationModal from './ConfirmationModal';
import '../../styles/components/dashboard/CoachManagement.css';

// ─── Constantes ──────────────────────────────────────────────────────────────
const WEEK_DAYS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' },
];

const CATEGORIES = ['Fuerza', 'Cardio', 'Bienestar', 'Personal', 'Técnica', 'Flexibilidad'];

const EMPTY_FORM = {
  title: '',
  description: '',
  day_of_week: 1,
  start_time: '09:00',
  end_time: '10:00',
  is_coaching: false,
  category: 'Fuerza',
};

// ─── Formulario modal ─────────────────────────────────────────────────────────
const SessionFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const isEdit = !!initialData?.session_id;

  return (
    <div className="session-modal-backdrop" onClick={onClose}>
      <div className="session-modal-panel" onClick={e => e.stopPropagation()}>
        <div className="session-modal-header">
          <h2>{isEdit ? 'Editar Sesión' : 'Nueva Sesión'}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form className="session-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Título */}
            <div className="form-field full-width">
              <label>Título de la sesión *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Yoga Flow, HIIT Express..."
                required
                maxLength={150}
              />
            </div>

            {/* Día */}
            <div className="form-field">
              <label>Día de la semana *</label>
              <select name="day_of_week" value={form.day_of_week} onChange={handleChange} required>
                {WEEK_DAYS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div className="form-field">
              <label>Categoría</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Hora inicio */}
            <div className="form-field">
              <label>Hora inicio *</label>
              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
            </div>

            {/* Hora fin */}
            <div className="form-field">
              <label>Hora fin *</label>
              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
            </div>

            {/* Tipo */}
            <div className="form-field full-width">
              <label className="toggle-label">
                <span>Tipo de sesión</span>
                <div className="toggle-wrapper">
                  <span className={!form.is_coaching ? 'toggle-opt active' : 'toggle-opt'}>Grupal</span>
                  <button
                    type="button"
                    className={`toggle-switch ${form.is_coaching ? 'on' : 'off'}`}
                    onClick={() => setForm(prev => ({ ...prev, is_coaching: !prev.is_coaching }))}
                  >
                    <span className="toggle-knob" />
                  </button>
                  <span className={form.is_coaching ? 'toggle-opt active' : 'toggle-opt'}>Personal</span>
                </div>
              </label>
            </div>

            {/* Descripción */}
            <div className="form-field full-width">
              <label>Descripción (opcional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe brevemente la sesión..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="form-btn-save" disabled={saving}>
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
