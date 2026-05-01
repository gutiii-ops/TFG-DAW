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

module.exports = {
    getTicketsPaginated
};

