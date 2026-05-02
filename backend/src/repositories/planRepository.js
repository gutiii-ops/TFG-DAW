const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Obtiene todos los planes de suscripción disponibles en el catálogo.
 */
const getAllPlans = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT * FROM plans ORDER BY plan_price ASC');
    return result.recordset;
};

/**
 * Obtiene un plan específico por su ID.
 * @param {number} planId 
 */
const getPlanById = async (planId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('planId', sql.SmallInt, planId)
        .query('SELECT * FROM plans WHERE plan_id = @planId');
    return result.recordset[0];
};

module.exports = {
    getAllPlans,
    getPlanById
};
