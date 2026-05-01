const { poolPromise } = require('../config/dbConfig');

/**
 * Obtiene todos los productos de la base de datos.
 * @returns {Promise<Array>}
 */
const getAll = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM products');
    return result.recordset;
};

/**
 * Obtiene un producto por su ID.
 * @param {number} productId 
 * @returns {Promise<Object|null>}
 */
const getById = async (productId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', productId)
        .query('SELECT * FROM products WHERE product_id = @id');
    return result.recordset[0] || null;
};

module.exports = {
    getAll,
    getById
};
