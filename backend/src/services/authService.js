const bcrypt = require('bcrypt');
const authRepository = require('../repositories/authRepository');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-super-seguro';

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

  // 4. Generación de JWT real incluyendo el rol y el nombre
  const payload = {
    userId: user.user_id,
    userName: user.user_name,
    role: user.role_name || 'User'
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
  
  // 5. Guardar token en el repositorio (opcional, si mantenemos el control de tokens válidos)
  await authRepository.saveToken(token, user.user_id);

  // Devolvemos el token, el id y también el ROL para el frontend
  return { token, userId: user.user_id, role: payload.role };
};

const register = async (userData) => {
  const { email, password, name, lastName } = userData;
  
  if (!email || !password || !name || !lastName) {
    const error = new Error('Faltan datos obligatorios (Nombre, Apellido, Email, Password)');
    error.status = 400;
    throw error;
  }

  // 1. Verificar si el usuario ya existe
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    const error = new Error('El correo electrónico ya está registrado');
    error.status = 409;
    throw error;
  }

  const saltRounds = 10;
  userData.password_hash = await bcrypt.hash(password, saltRounds);

  // 3. Formatear fecha para SQL Server (de DD/MM/YYYY a YYYY-MM-DD)
  if (userData.birthDate && userData.birthDate.includes('/')) {
    const [day, month, year] = userData.birthDate.split('/');
    userData.birthDate = `${year}-${month}-${day}`;
  }

  // 4. Crear el usuario en la BBDD
  const userId = await authRepository.createUser(userData);

  return { message: 'Registro completado con éxito', userId };
};

const validateToken = async (token) => {
  return await authRepository.validateToken(token);
};

module.exports = {
  login,
  register,
  validateToken
};
