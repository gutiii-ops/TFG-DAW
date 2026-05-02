import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ConfirmationModal from './ConfirmationModal';
import CoachManagementView from './CoachManagementView';
import '../../styles/components/dashboard/CoachingSection.css';

const CoachingSection = () => {
    const { user, token, role } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationContext);

    // Los coaches tienen su propia vista de gestión
    if (role === 'Coach') return <CoachManagementView />;


    const [sessions, setSessions] = useState([]);
    const [userReservations, setUserReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
    
    // Estado para el modal de confirmación
    const [modalConfig, setModalConfig] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: () => {}, 
        actionType: '' 
    });

    const weekDays = [
        { id: 1, name: 'Lun' },
        { id: 2, name: 'Mar' },
        { id: 3, name: 'Mié' },
        { id: 4, name: 'Jue' },
        { id: 5, name: 'Vie' },
        { id: 6, name: 'Sáb' },
        { id: 7, name: 'Dom' }
    ];

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
                    reservationDate: new Date().toISOString().split('T')[0]
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
            <div className="coaching-header">
                <h1>Coaching & Clases</h1>
                <p>Gestiona tus entrenamientos y reserva sesiones con nuestros expertos.</p>
            </div>

            <div className="days-selector">
                {weekDays.map(day => (
                    <button 
                        key={day.id}
                        className={`day-btn ${selectedDay === day.id ? 'is-active' : ''}`}
                        onClick={() => setSelectedDay(day.id)}
                    >
                        <span className="day-name">{day.name}</span>
                        <span className="day-number">{day.id}</span>
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

                                <div className="session-actions">
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
                confirmText={modalConfig.actionType === 'cancel' ? 'Confirmar Cancelación' : 'Confirmar Reserva'}
            />
        </div>
    );
};

export default CoachingSection;
