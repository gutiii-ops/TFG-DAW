const { users, roles, user_roles } = require('../api/data/mockData');

/**
 * Busca un usuario por su correo electrónico.
 * Simula una llamada asíncrona a la BBDD realizando el JOIN con roles.
 * 
 * @param {string} email - Correo a buscar.
 * @returns {Promise<Object|null>} El usuario o null si no se encuentra.
 */
const findUserByEmail = async (email) => {
  // En el futuro: SELECT u.*, r.role_name FROM users u LEFT JOIN user_roles ur ON ... LEFT JOIN roles r ON ...
  const user = users.find((item) => item.user_email === email);
  if (!user) return null;

  // Simulamos el comportamiento del JOIN
  const userRoleLink = user_roles.find(ur => ur.user_id === user.user_id);
  const userRole = userRoleLink ? roles.find(r => r.role_id === userRoleLink.role_id) : null;

  // Devolvemos el objeto usuario con la propiedad unida role_name
  return {
    ...user,
    role_name: userRole ? userRole.role_name : 'User'
  };
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
