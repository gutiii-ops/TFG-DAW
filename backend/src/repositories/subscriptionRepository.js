const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Obtiene la suscripción activa actual de un usuario.
 * @param {number} userId 
 */
const getActiveSubscriptionByUserId = async (userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT TOP 1 s.*, p.plan_name, p.plan_description, p.plan_price, p.plan_duration
            FROM subscriptions s
            JOIN plans p ON s.plan_id = p.plan_id
            WHERE s.user_id = @userId AND s.end_date >= GETDATE()
            ORDER BY s.subscription_status DESC, s.end_date DESC
        `);
    return result.recordset[0];
};

/**
 * Crea una nueva suscripción para un usuario.
 * @param {number} userId 
 * @param {number} planId 
 * @param {number} durationDays 
 */
const createSubscription = async (userId, planId, durationDays) => {
    const pool = await poolPromise;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('planId', sql.SmallInt, planId)
        .input('startDate', sql.Date, startDate)
        .input('endDate', sql.Date, endDate)
        .query(`
            INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, subscription_status)
            OUTPUT INSERTED.subscription_id
            VALUES (@userId, @planId, @startDate, @endDate, 1)
        `);
    return result.recordset[0];
};

/**
 * Cancela una suscripción activa (la marca como inactiva/no renovable).
 * @param {number} subscriptionId 
 */
const cancelSubscription = async (subscriptionId) => {
    const pool = await poolPromise;
    await pool.request()
        .input('subscriptionId', sql.Int, subscriptionId)
        .query('UPDATE subscriptions SET subscription_status = 0 WHERE subscription_id = @subscriptionId');
    return true;
};

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
    getActiveSubscriptionByUserId,
    createSubscription,
    cancelSubscription,
    getSubscriptionsPaginated
};
