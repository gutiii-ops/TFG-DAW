const userRepository = require('../repositories/userRepository');

/**
 * Obtiene los detalles completos de un usuario según su ID.
 * @param {number} userId 
 * @returns {Promise<Object>}
 */
const getUser = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return user;
};

/**
 * Actualiza los campos especificados de un usuario asegurando validaciones de negocio.
 * 
 * @param {number} targetUserId - ID del usuario a modificar.
 * @param {number} requestingUserId - ID de quien realiza la petición (para permisos).
 * @param {Object} rawData - Datos enviados en el body de la petición HTTP.
 * @returns {Promise<Object>}
 */
const updateUser = async (targetUserId, requestingUserId, rawData) => {
  // 1. Verificamos que el usuario objetivo exista
  const user = await userRepository.findById(targetUserId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  // 2. Control de Autorización de cuenta (Lógica de Negocio Pura)
  if (requestingUserId && requestingUserId !== targetUserId) {
    const error = new Error('No autorizado para actualizar este usuario');
    error.status = 403;
    throw error;
  }

  // 3. Filtrado de datos (Sanitización básica para no colar campos falsos)
  const allowedFields = [
    'user_name',
    'user_surname',
    'user_phone',
    'user_email',
    'user_region',
    'user_IdDocument',
    'user_date'
  ];

  const updates = Object.keys(rawData).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = rawData[key];
    }
    return acc;
  }, {});

  // Si no hay nada que actualizar, podríamos retornar el usuario tal cual
  if (Object.keys(updates).length === 0) {
    return user;
  }

  // 4. Delegar en el repositorio la persistencia de datos (Mock)
  const updatedUser = await userRepository.updateUser(targetUserId, updates);
  
  return updatedUser;
};

const getAllUsers = async (search, page, limit) => {
  return await userRepository.findAll(search, page, limit);
};

/**
 * Cambia el rol de un usuario (Acción de Admin).
 */
const changeUserRole = async (userId, roleId, requestingUserId) => {
  // 1. Validación: No puedes modificarte el rol a ti mismo
  if (Number(userId) === Number(requestingUserId)) {
    const error = new Error('No puedes modificar tu propio rol.');
    error.status = 400;
    throw error;
  }

  // 2. Validación: No puedes modificar el rol de otro usuario que actualmente sea Administrador
  const currentRoleName = await userRepository.getUserRoleName(userId);
  if (currentRoleName === 'Admin') {
    const error = new Error('Acción denegada: No se puede modificar el rol de un Administrador.');
    error.status = 403;
    throw error;
  }

  return await userRepository.updateRole(userId, roleId);
};

module.exports = {
  getUser,
  updateUser,
  getAllUsers,
  changeUserRole
};
