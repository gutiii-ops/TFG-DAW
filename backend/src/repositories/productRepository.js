const { poolPromise, sql } = require('../config/dbConfig');

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
        .input('id', sql.Int, productId)
        .query('SELECT * FROM products WHERE product_id = @id');
    return result.recordset[0] || null;
};

/**
 * Crea un nuevo producto en el sistema.
 */
const create = async ({ name, description, category, price, imageUrl }) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('name', sql.VarChar(150), name)
        .input('description', sql.VarChar(sql.MAX), description || null)
        .input('category', sql.TinyInt, Number(category))
        .input('price', sql.Decimal(10, 2), Number(price))
        .input('imageUrl', sql.VarChar(255), imageUrl || null)
        .query(`
            INSERT INTO products (product_name, product_description, product_category, product_price, product_image_url)
            OUTPUT INSERTED.product_id
            VALUES (@name, @description, @category, @price, @imageUrl)
        `);
    return result.recordset[0].product_id;
};

/**
 * Actualiza un producto existente.
 */
const update = async (productId, { name, description, category, price, imageUrl }) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, productId)
        .input('name', sql.VarChar(150), name)
        .input('description', sql.VarChar(sql.MAX), description || null)
        .input('category', sql.TinyInt, Number(category))
        .input('price', sql.Decimal(10, 2), Number(price))
        .input('imageUrl', sql.VarChar(255), imageUrl || null)
        .query(`
            UPDATE products
            SET product_name = @name,
                product_description = @description,
                product_category = @category,
                product_price = @price,
                product_image_url = @imageUrl
            WHERE product_id = @id
        `);
    return result.rowsAffected[0] > 0;
};

/**
 * Elimina un producto del inventario.
 */
const deleteProduct = async (productId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, productId)
        .query('DELETE FROM products WHERE product_id = @id');
    return result.rowsAffected[0] > 0;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteProduct
};
