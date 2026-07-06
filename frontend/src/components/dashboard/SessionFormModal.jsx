import React, { useState, useEffect } from 'react';

// ─── Constantes ──────────────────────────────────────────────────────────────
export const WEEK_DAYS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' },
];

export const CATEGORIES = ['Fuerza', 'Cardio', 'Bienestar', 'Personal', 'Técnica', 'Flexibilidad'];

export const EMPTY_FORM = {
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

export default SessionFormModal;
