const bcrypt = require('bcrypt');
const authRepository = require('../repositories/authRepository');

/**
 * Servicio encargado de gestionar la lógica de negocio para la autenticación.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Retorna un objeto con el token y el ID de usuario.
 * @throws {Error} Lanza error si fallan las validaciones.
 */
const login = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Email y contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  // 1. Delegamos en el repositorio la búsqueda
  const user = await authRepository.findUserByEmail(email);

  // 2. Aplicamos reglas de negocio (usuario no existe)
  if (!user) {
    const error = new Error('Credenciales incorrectas');
    error.status = 401;
    throw error;
  }

  // 3. Regla de negocio: validar password con bcrypt
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    const error = new Error('Credenciales incorrectas');
    error.status = 401;
    throw error;
  }

  // 4. Generación de token (acá crearemos el JWT en el futuro)
  const token = `mock-token-user-${user.user_id}`;
  
  // 5. Guardar token en el repositorio
  await authRepository.saveToken(token, user.user_id);

  return { token, userId: user.user_id };
};

const validateToken = async (token) => {
  // Delegado directamente porque no hay mucha lógica de negocio extra por ahora
  return await authRepository.validateToken(token);
};

module.exports = {
  login,
  validateToken
};
