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

/**
 * Crea un nuevo pedido con sus detalles en una sola transacción.
 * @param {number} userId - ID del usuario que realiza la compra.
 * @param {number} totalPrice - Importe total del pedido.
 * @param {Array} items - Lista de productos [{productId, quantity, unitPrice}, ...]
 */
const createOrder = async (userId, totalPrice, items) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();

        // 1. Insertar la cabecera del pedido (orders)
        const orderRequest = new sql.Request(transaction);
        const orderResult = await orderRequest
            .input('userId', sql.Int, userId)
            .input('orderDate', sql.DateTime, new Date())
            .input('totalPrice', sql.Decimal(10, 2), totalPrice)
            .query(`
                INSERT INTO orders (user_id, order_date, total_price)
                OUTPUT INSERTED.order_id
                VALUES (@userId, @orderDate, @totalPrice)
            `);
        
        const orderId = orderResult.recordset[0].order_id;

        // 2. Insertar los detalles (order_details)
        for (const item of items) {
            const detailRequest = new sql.Request(transaction);
            await detailRequest
                .input('orderId', sql.BigInt, orderId)
                .input('productId', sql.Int, item.id)
                .input('quantity', sql.SmallInt, item.quantity)
                .input('unitPrice', sql.Decimal(10, 2), item.price)
                .query(`
                    INSERT INTO order_details (order_id, product_id, quantity, unit_price)
                    VALUES (@orderId, @productId, @quantity, @unitPrice)
                `);
        }

        await transaction.commit();
        return { orderId, success: true };

    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getByUserId,
    getOrderWithDetails,
    createOrder
};
