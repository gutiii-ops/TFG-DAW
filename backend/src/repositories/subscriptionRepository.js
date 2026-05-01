const { poolPromise, sql } = require('../config/dbConfig');

const getSubscriptionsPaginated = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const pool = await poolPromise;
    
    const countResult = await pool.request().query('SELECT COUNT(*) as total FROM subscriptions');
    const total = countResult.recordset[0].total;

    const dataResult = await pool.request()
        .input('offset', sql.Int, offset)
        .input('limit', sql.Int, limit)
        .query(`
            SELECT s.*, u.user_name + ' ' + u.user_surname as user_name, p.plan_name as plan
            FROM subscriptions s
            JOIN users u ON s.user_id = u.user_id
            JOIN plans p ON s.plan_id = p.plan_id
            ORDER BY s.start_date DESC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `);

    return {
        data: dataResult.recordset,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

module.exports = {
    getSubscriptionsPaginated
};
