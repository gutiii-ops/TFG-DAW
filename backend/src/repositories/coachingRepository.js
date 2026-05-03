const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Obtiene todas las sesiones de entrenamiento (clases o coaching) disponibles.
 */
const getAllSessions = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM coaching_sessions ORDER BY day_of_week, start_time');
    return result.recordset;
};

/**
 * Obtiene las reservas de un usuario específico.
 */
const getReservationsByUserId = async (userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT cr.*, cs.title, cs.start_time, cs.end_time, cs.is_coaching 
            FROM coaching_reservations cr
            JOIN coaching_sessions cs ON cr.session_id = cs.session_id
            WHERE cr.user_id = @userId
            ORDER BY cr.reservation_date, cs.start_time
        `);
    return result.recordset;
};

/**
 * Crea una nueva reserva.
 */
const createReservation = async (userId, sessionId, reservationDate) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('sessionId', sql.Int, sessionId)
        .input('reservationDate', sql.Date, reservationDate)
        .query(`
            INSERT INTO coaching_reservations (user_id, session_id, reservation_date)
            OUTPUT INSERTED.reservation_id
            VALUES (@userId, @sessionId, @reservationDate)
        `);
    return result.recordset[0].reservation_id;
};

/**
 * Elimina una reserva.
 */
const deleteReservation = async (reservationId, userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('reservationId', sql.Int, reservationId)
        .input('userId', sql.Int, userId)
        .query('DELETE FROM coaching_reservations WHERE reservation_id = @reservationId AND user_id = @userId');
    return result.rowsAffected[0] > 0;
};

/**
 * Verifica si ya existe una reserva para evitar duplicados.
 */
const checkExisting = async (userId, sessionId, reservationDate) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('sessionId', sql.Int, sessionId)
        .input('reservationDate', sql.Date, reservationDate)
        .query('SELECT reservation_id FROM coaching_reservations WHERE user_id = @userId AND session_id = @sessionId AND reservation_date = @reservationDate');
    return result.recordset.length > 0;
};

/**
 * Obtiene todas las sesiones que pertenecen a un coach específico.
 */
const getSessionsByCoachId = async (coachId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('coachId', sql.Int, coachId)
        .query('SELECT * FROM coaching_sessions WHERE coach_id = @coachId ORDER BY day_of_week, start_time');
    return result.recordset;
};

/**
 * Crea una nueva sesión vinculada a un coach.
 */
const createSession = async (coachId, { title, description, day_of_week, start_time, end_time, is_coaching, category }) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('coachId', sql.Int, coachId)
        .input('title', sql.VarChar(150), title)
        .input('description', sql.VarChar(sql.MAX), description || null)
        .input('day_of_week', sql.TinyInt, day_of_week)
        .input('start_time', sql.VarChar(8), start_time)
        .input('end_time', sql.VarChar(8), end_time)
        .input('is_coaching', sql.Bit, is_coaching ? 1 : 0)
        .input('category', sql.VarChar(50), category || null)
        .query(`
            INSERT INTO coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category, coach_id)
            OUTPUT INSERTED.session_id
            SELECT @title, @description,
                   (SELECT name FROM users WHERE user_id = @coachId),
                   @day_of_week, @start_time, @end_time, @is_coaching, @category, @coachId
        `);
    return result.recordset[0].session_id;
};

/**
 * Actualiza una sesión, verificando que pertenece al coach.
 */
const updateSession = async (sessionId, coachId, { title, description, day_of_week, start_time, end_time, is_coaching, category }) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('sessionId', sql.Int, sessionId)
        .input('coachId', sql.Int, coachId)
        .input('title', sql.VarChar(150), title)
        .input('description', sql.VarChar(sql.MAX), description || null)
        .input('day_of_week', sql.TinyInt, day_of_week)
        .input('start_time', sql.VarChar(8), start_time)
        .input('end_time', sql.VarChar(8), end_time)
        .input('is_coaching', sql.Bit, is_coaching ? 1 : 0)
        .input('category', sql.VarChar(50), category || null)
        .query(`
            UPDATE coaching_sessions
            SET title = @title, description = @description,
                day_of_week = @day_of_week, start_time = @start_time,
                end_time = @end_time, is_coaching = @is_coaching, category = @category
            WHERE session_id = @sessionId AND coach_id = @coachId
        `);
    return result.rowsAffected[0] > 0;
};

/**
 * Elimina una sesión, verificando que pertenece al coach.
 */
const deleteSession = async (sessionId, coachId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('sessionId', sql.Int, sessionId)
        .input('coachId', sql.Int, coachId)
        .query('DELETE FROM coaching_sessions WHERE session_id = @sessionId AND coach_id = @coachId');
    return result.rowsAffected[0] > 0;
};

module.exports = {
    getAllSessions,
    getReservationsByUserId,
    createReservation,
    deleteReservation,
    checkExisting,
    // --- Coach management ---
    getSessionsByCoachId,
    createSession,
    updateSession,
    deleteSession
};
