import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ConfirmationModal from './ConfirmationModal';
import CoachManagementView from './CoachManagementView';
import SessionFormModal from './SessionFormModal';
import '../../styles/components/dashboard/CoachingSection.css';
import '../../styles/components/dashboard/CoachManagement.css';

const CoachingSection = () => {
    const { user, token, role } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationContext);

    // Los coaches tienen su propia vista de gestión
    if (role === 'Coach') return <CoachManagementView />;


    const [sessions, setSessions] = useState([]);
    const [userReservations, setUserReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    // Generar los próximos 7 días a partir de hoy
    const getNextSevenDays = () => {
        const days = [];
        const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push({
                id: d.getDay() === 0 ? 7 : d.getDay(), // Mapear 0 (Dom) a 7 para compatibilidad con DB
                name: names[d.getDay()],
                number: d.getDate(),
                fullDate: d.toISOString().split('T')[0]
            });
        }
        return days;
    };

    const [weekDays] = useState(getNextSevenDays());
    const [selectedDate, setSelectedDate] = useState(weekDays[0].fullDate);
    const [selectedDay, setSelectedDay] = useState(weekDays[0].id);

    // Estado para el modal de confirmación
    const [modalConfig, setModalConfig] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: () => {}, 
        actionType: '' 
    });

    // Estado para el formulario modal de Admin
    const [formOpen, setFormOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    // Normalizar el tiempo a HH:MM
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

    const handleSaveAdmin = async (formData) => {
        if (!token) return;
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
                addNotification(isEdit ? 'Sesión actualizada correctamente' : 'Sesión creada correctamente', 'success');
                setFormOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                addNotification(err.error || 'Error al guardar sesión', 'error');
            }
        } catch {
            addNotification('Error de conexión', 'error');
        }
    };

    const handleDeleteClick = (session) => {
        setModalConfig({
            isOpen: true,
            title: 'Eliminar Sesión (ADMIN)',
            message: `¿Estás seguro de que quieres eliminar permanentemente la sesión "${session.title}"? Esta acción no se puede deshacer y afectará a todos los usuarios apuntados.`,
            onConfirm: () => executeDeleteAdmin(session.session_id),
            actionType: 'delete_session'
        });
    };

    const executeDeleteAdmin = async (sessionId) => {
        try {
            const res = await fetch(`http://localhost:8000/api/coach/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                addNotification('Sesión eliminada con éxito', 'success');
                fetchData();
            } else {
                addNotification('Error al eliminar la sesión', 'error');
            }
        } catch {
            addNotification('Error de red al intentar eliminar', 'error');
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [sessionsRes, reservationsRes] = await Promise.all([
                fetch('http://localhost:8000/api/reservations/sessions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`http://localhost:8000/api/reservations/user/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (sessionsRes.ok && reservationsRes.ok) {
                const sessionsData = await sessionsRes.json();
                const reservationsData = await reservationsRes.json();
                setSessions(sessionsData);
                setUserReservations(reservationsData);
            }
        } catch (error) {
            addNotification('Error al cargar el horario', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, user.id, addNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredSessions = sessions.filter(s => s.day_of_week === selectedDay);

    const handleReserve = (session) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Reserva',
            message: `¿Estás seguro de que quieres reservar tu plaza para "${session.title}"?`,
            onConfirm: () => executeReserve(session),
            actionType: 'reserve'
        });
    };

    const executeReserve = async (session) => {
        try {
            const response = await fetch('http://localhost:8000/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sessionId: session.session_id,
                    reservationDate: selectedDate
                })
            });

            if (response.ok) {
                addNotification('¡Reserva confirmada!', 'success');
                fetchData();
            } else {
                const err = await response.json();
                addNotification(err.error || 'Error al reservar', 'error');
            }
        } catch (error) {
            addNotification('Error de conexión', 'error');
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleCancelClick = (reservationId) => {
        setModalConfig({
            isOpen: true,
            title: 'Cancelar Reserva',
            message: '¿Estás seguro de que deseas cancelar tu asistencia? Esta acción no se puede deshacer.',
            onConfirm: () => executeCancel(reservationId),
            actionType: 'cancel'
        });
    };

    const executeCancel = async (reservationId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                addNotification('Reserva cancelada correctamente', 'success');
                fetchData();
            }
        } catch (error) {
            addNotification('Error al cancelar', 'error');
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--';
        // Si el backend envía el objeto TIME de SQL Server como string ISO (ej: 1970-01-01T09:00:00.000Z)
        if (typeof timeStr === 'string' && timeStr.includes('T')) {
            return timeStr.split('T')[1].substring(0, 5);
        }
        return String(timeStr).substring(0, 5);
    };

    return (
        <div className="coaching-section-wrapper">
            <div className="coaching-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1>Coaching & Clases</h1>
                    <p>Gestiona tus entrenamientos y reserva sesiones con nuestros expertos.</p>
                </div>
                {role === 'Admin' && (
                    <button className="create-session-btn" onClick={handleOpenCreate} style={{ margin: 0 }}>
                        + Nueva Sesión
                    </button>
                )}
            </div>

            <div className="days-selector">
                {weekDays.map(day => (
                    <button 
                        key={day.fullDate}
                        className={`day-btn ${selectedDate === day.fullDate ? 'is-active' : ''}`}
                        onClick={() => {
                            setSelectedDate(day.fullDate);
                            setSelectedDay(day.id);
                        }}
                    >
                        <span className="day-name">{day.name}</span>
                        <span className="day-number">{day.number}</span>
                    </button>
                ))}
            </div>

            <div className="sessions-timeline">
                {loading ? (
                    <div className="loading-state">Cargando horario...</div>
                ) : filteredSessions.length > 0 ? (
                    filteredSessions.map(session => {
                        const reservation = userReservations.find(r => r.session_id === session.session_id);
                        return (
                            <div key={session.session_id} className={`session-card ${reservation ? 'is-booked' : ''}`}>
                                <div className="session-time">
                                    <span className="time-start">{formatTime(session.start_time)}</span>
                                    <span className="time-end">{formatTime(session.end_time)}</span>
                                </div>

                                <div className="session-info">
                                    <div className="session-title">
                                        {session.title}
                                        <span className={`session-badge ${session.is_coaching ? 'coaching' : ''}`}>
                                            {session.is_coaching ? 'Personal' : 'Grupal'}
                                        </span>
                                    </div>
                                    <div className="session-instructor">Instructor: {session.instructor_name || 'Staff Gym'}</div>
                                </div>

                                <div className="session-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {role === 'Admin' && (
                                        <div className="admin-btns-group" style={{ display: 'flex', gap: '0.3rem' }}>
                                            <button 
                                                className="cscard-btn edit" 
                                                onClick={() => handleOpenEdit(session)} 
                                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', minWidth: 'auto' }}
                                                title="Editar Sesión"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="cscard-btn delete" 
                                                onClick={() => handleDeleteClick(session)} 
                                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', minWidth: 'auto' }}
                                                title="Eliminar Sesión"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                    {reservation ? (
                                        <button 
                                            className="reserve-btn cancel"
                                            onClick={() => handleCancelClick(reservation.reservation_id)}
                                        >
                                            Cancelar
                                        </button>
                                    ) : (
                                        <button 
                                            className="reserve-btn primary"
                                            onClick={() => handleReserve(session)}
                                        >
                                            Reservar
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-sessions">
                        <div className="empty-icon">📅</div>
                        <h3>No hay actividades programadas</h3>
                        <p>No se han encontrado sesiones para este día. Por favor, selecciona otra fecha.</p>
                    </div>
                )}
            </div>

            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                confirmText={
                    modalConfig.actionType === 'cancel' ? 'Confirmar Cancelación' : 
                    modalConfig.actionType === 'delete_session' ? 'Eliminar Sesión' : 'Confirmar Reserva'
                }
            />

            {role === 'Admin' && (
                <SessionFormModal
                    isOpen={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSave={handleSaveAdmin}
                    initialData={editingSession}
                />
            )}
        </div>
    );
};

export default CoachingSection;
