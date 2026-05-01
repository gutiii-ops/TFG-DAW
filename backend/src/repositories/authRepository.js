const { poolPromise, sql } = require('../config/dbConfig');

/**
 * Busca un usuario por su correo electrónico en la BBDD real.
 * Realiza el JOIN con la tabla de roles para obtener el permiso del usuario.
 * 
 * @param {string} email - Correo a buscar.
 * @returns {Promise<Object|null>} El usuario o null si no se encuentra.
 */
const findUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query(`
      SELECT u.*, r.role_name 
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      WHERE u.user_email = @email
    `);
  
  return result.recordset[0] || null;
};

// Nota: El manejo de tokens sigue siendo preferiblemente vía JWT (stateless), 
// pero dejamos las funciones por si el servicio las requiere.
const validTokens = new Map();

const saveToken = async (token, userId) => {
  validTokens.set(token, userId);
};

const validateToken = async (token) => {
  return validTokens.get(token) || null;
};

module.exports = {
  findUserByEmail,
  saveToken,
  validateToken
};
