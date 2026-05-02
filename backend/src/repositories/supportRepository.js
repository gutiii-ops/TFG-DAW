const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Obtiene los tickets de soporte con paginación.
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise<Object>} { data, total }
 */
const getTicketsPaginated = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const pool = await poolPromise;
    
    const countResult = await pool.request().query('SELECT COUNT(*) as total FROM support_tickets');
    const total = countResult.recordset[0].total;

    const dataResult = await pool.request()
        .input('offset', sql.Int, offset)
        .input('limit', sql.Int, limit)
        .query(`
            SELECT t.*, u.user_name + ' ' + u.user_surname as user_full_name
            FROM support_tickets t
            JOIN users u ON t.user_id = u.user_id
            ORDER BY t.created_at DESC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `);

    return {
        data: dataResult.recordset,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Obtiene los tickets de un usuario específico.
 */
const getTicketsByUser = async (userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM support_tickets WHERE user_id = @userId ORDER BY created_at DESC');
    return result.recordset;
};

/**
 * Obtiene los mensajes de un ticket específico.
 */
const getMessagesByTicket = async (ticketId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('ticketId', sql.Int, ticketId)
        .query(`
            SELECT m.*, u.user_name 
            FROM support_messages m
            JOIN users u ON m.sender_id = u.user_id
            WHERE m.ticket_id = @ticketId 
            ORDER BY m.sent_at ASC
        `);
    return result.recordset;
};

/**
 * Crea la cabecera de un ticket.
 */
const createTicket = async (userId, subject, priority = 1) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('subject', sql.VarChar, subject)
        .input('priority', sql.TinyInt, priority)
        .query(`
            INSERT INTO support_tickets (user_id, subject, priority)
            OUTPUT INSERTED.ticket_id
            VALUES (@userId, @subject, @priority)
        `);
    return result.recordset[0].ticket_id;
};

/**
 * Crea un mensaje en un ticket.
 */
const createMessage = async (ticketId, senderId, messageText) => {
    const pool = await poolPromise;
    await pool.request()
        .input('ticketId', sql.Int, ticketId)
        .input('senderId', sql.Int, senderId)
        .input('messageText', sql.VarChar, messageText)
        .query(`
            INSERT INTO support_messages (ticket_id, sender_id, message_text)
            VALUES (@ticketId, @senderId, @messageText)
        `);
    
    // Actualizar la fecha de actualización del ticket
    await pool.request()
        .input('ticketId', sql.Int, ticketId)
        .query('UPDATE support_tickets SET updated_at = GETDATE() WHERE ticket_id = @ticketId');
};

module.exports = {
    getTicketsPaginated,
    getTicketsByUser,
    getMessagesByTicket,
    createTicket,
    createMessage
};


