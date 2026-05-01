const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Busca un usuario por su ID numérico en la BBDD real.
 * @param {number} userId 
 * @returns {Promise<Object|null>}
 */
const findById = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query('SELECT * FROM users WHERE user_id = @userId');
  
  return result.recordset[0] || null;
};

/**
 * Actualiza los datos de un usuario en SQL Server.
 * 
 * @param {number} userId 
 * @param {Object} updates 
 * @returns {Promise<Object|null>}
 */
const updateUser = async (userId, updates) => {
  const pool = await poolPromise;
  
  // Construcción dinámica de la query de update (simplificada)
  const fields = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
  
  const request = pool.request();
  request.input('userId', sql.Int, userId);
  Object.keys(updates).forEach(key => {
    request.input(key, updates[key]);
  });

  await request.query(`UPDATE users SET ${fields} WHERE user_id = @userId`);

  return findById(userId);
};

module.exports = {
  findById,
  updateUser
};
