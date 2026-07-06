const coachingRepository = require('../repositories/coachingRepository');

const getAvailableSchedule = async () => {
    return await coachingRepository.getAllSessions();
};

const getUserBookings = async (userId) => {
    return await coachingRepository.getReservationsByUserId(userId);
};

const makeBooking = async (userId, sessionId, date) => {
    // 1. Verificar si ya está reservado
    const exists = await coachingRepository.checkExisting(userId, sessionId, date);
    if (exists) {
        throw new Error('Ya tienes una reserva para esta sesión en esta fecha.');
    }

    // 2. Crear reserva
    const reservationId = await coachingRepository.createReservation(userId, sessionId, date);
    return { success: true, reservationId };
};

const cancelBooking = async (reservationId, userId) => {
    const success = await coachingRepository.deleteReservation(reservationId, userId);
    if (!success) {
        throw new Error('No se pudo cancelar la reserva o no te pertenece.');
    }
    return { success: true };
};

const getCoachSessions = async (coachId) => {
    return await coachingRepository.getSessionsByCoachId(coachId);
};

const createCoachSession = async (coachId, data) => {
    console.log('Validando data:', data);
    if (!data.title || !data.day_of_week || !data.start_time || !data.end_time) {
        throw new Error('Faltan campos obligatorios: título, día, hora inicio y hora fin.');
    }
    console.log('Obteniendo instructorName para coachId:', coachId);
    const instructorName = await coachingRepository.getUserNameById(coachId);
    console.log('InstructorName:', instructorName);
    if (!instructorName) {
        throw new Error('Usuario no encontrado.');
    }
    console.log('Creando sesión con data:', { ...data, instructorName });
    const sessionId = await coachingRepository.createSession(coachId, { ...data, instructorName });
    console.log('SessionId creado:', sessionId);
    return { success: true, sessionId };
};

const updateCoachSession = async (sessionId, coachId, data, isAdmin = false) => {
    const updated = await coachingRepository.updateSession(sessionId, coachId, data, isAdmin);
    if (!updated) throw new Error('No se pudo actualizar. La sesión no existe o no te pertenece.');
    return { success: true };
};

const deleteCoachSession = async (sessionId, coachId, isAdmin = false) => {
    const deleted = await coachingRepository.deleteSession(sessionId, coachId, isAdmin);
    if (!deleted) throw new Error('No se pudo eliminar. La sesión no existe o no te pertenece.');
    return { success: true };
};

module.exports = {
    getAvailableSchedule,
    getUserBookings,
    makeBooking,
    cancelBooking,
    // --- Coach management ---
    getCoachSessions,
    createCoachSession,
    updateCoachSession,
    deleteCoachSession
};
