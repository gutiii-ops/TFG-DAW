const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Obtiene los pedidos de un usuario específico.
 * @param {number} userId 
 */
const getByUserId = async (userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM orders WHERE user_id = @userId ORDER BY order_date DESC');
    return result.recordset;
};

/**
 * Obtiene los detalles de un pedido incluyendo nombres de productos.
 * @param {number} orderId 
 */
const getOrderWithDetails = async (orderId) => {
    const pool = await poolPromise;
    
    const orderResult = await pool.request()
        .input('orderId', sql.BigInt, orderId)
        .query('SELECT * FROM orders WHERE order_id = @orderId');
    
    const order = orderResult.recordset[0];
    if (!order) return null;

    const detailsResult = await pool.request()
        .input('orderId', sql.BigInt, orderId)
        .query(`
            SELECT od.*, p.product_name 
            FROM order_details od
            JOIN products p ON od.product_id = p.product_id
            WHERE od.order_id = @orderId
        `);

    return {
        ...order,
        details: detailsResult.recordset
    };
};

module.exports = {
    getByUserId,
    getOrderWithDetails
};
