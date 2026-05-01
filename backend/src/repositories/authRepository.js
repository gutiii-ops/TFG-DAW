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

/**
 * Crea un nuevo usuario en la base de datos y le asigna el rol de 'User' por defecto.
 * @param {Object} userData 
 * @returns {Promise<number>} El ID del nuevo usuario creado.
 */
const createUser = async (userData) => {
  const pool = await poolPromise;
  
  // 1. Insertamos el usuario
  const result = await pool.request()
    .input('name', sql.VarChar, userData.name)
    .input('surname', sql.VarChar, userData.lastName)
    .input('phone', sql.VarChar, userData.phone)
    .input('email', sql.VarChar, userData.email)
    .input('idDoc', sql.VarChar, userData.documentId)
    .input('date', sql.Date, userData.birthDate)
    .input('region', sql.VarChar, userData.country)
    .input('pass', sql.VarChar, userData.password_hash)
    .query(`
      INSERT INTO users (user_name, user_surname, user_phone, user_email, user_IdDocument, user_date, user_region, password_hash)
      OUTPUT INSERTED.user_id
      VALUES (@name, @surname, @phone, @email, @idDoc, @date, @region, @pass)
    `);
  
  const userId = result.recordset[0].user_id;
  
  // 2. Asignamos rol de 'User' (ID 1 según requerimiento del usuario)
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('roleId', sql.Int, 1)
    .query('INSERT INTO user_roles (user_id, role_id) VALUES (@userId, @roleId)');
  
  return userId;
};

// --- Gestión de Tokens (En memoria por ahora) ---
const validTokens = new Map();

const saveToken = async (token, userId) => {
  validTokens.set(token, userId);
};

const validateToken = async (token) => {
  return validTokens.get(token) || null;
};

module.exports = {
  findUserByEmail,
  createUser,
  saveToken,
  validateToken
};

