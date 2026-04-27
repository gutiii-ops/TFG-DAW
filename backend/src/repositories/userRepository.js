const { users } = require('../api/data/mockData');

/**
 * Busca un usuario por su ID numérico.
 * @param {number} userId 
 * @returns {Promise<Object|null>}
 */
const findById = async (userId) => {
  // En el futuro: return await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
  const user = users.find((item) => item.user_id === userId);
  return user || null;
};

/**
 * Actualiza los datos de un usuario en el sistema de mocks.
 * Devuelve el usuario modificado resultante.
 * 
 * @param {number} userId 
 * @param {Object} updates 
 * @returns {Promise<Object|null>}
 */
const updateUser = async (userId, updates) => {
  const userIndex = users.findIndex((item) => item.user_id === userId);
  
  if (userIndex === -1) {
    return null;
  }

  // Modificamos el objeto internamente
  users[userIndex] = {
    ...users[userIndex],
    ...updates
  };

  return users[userIndex];
};

module.exports = {
  findById,
  updateUser
};
