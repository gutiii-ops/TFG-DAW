const { users } = require('../api/data/mockData');

/**
 * Busca un usuario por su correo electrónico.
 * Simula una llamada asíncrona a la BBDD.
 * 
 * @param {string} email - Correo a buscar.
 * @returns {Promise<Object|null>} El usuario o null si no se encuentra.
 */
const findUserByEmail = async (email) => {
  // En el futuro: return await db.query('SELECT * FROM users WHERE user_email = ?', [email]);
  const user = users.find((item) => item.user_email === email);
  return user || null;
};

// Simulamos un almacén de memoria temporal para los tokens activos.
const validTokens = new Map();

/**
 * Guarda el token generado como válido para el usuario.
 * @param {string} token 
 * @param {number} userId 
 */
const saveToken = async (token, userId) => {
  validTokens.set(token, userId);
};

/**
 * Valida si un token existe en los registros activos.
 * @param {string} token 
 * @returns {Promise<number|null>} El ID del usuario si es válido, de lo contrario null.
 */
const validateToken = async (token) => {
  return validTokens.get(token) || null;
};

module.exports = {
  findUserByEmail,
  saveToken,
  validateToken
};
