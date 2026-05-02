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

/**
 * Obtiene el listado de usuarios con sus roles y permisos agregados.
 * Soporta búsqueda por nombre/email y paginación.
 */
const findAll = async (search = '', page = 1, limit = 10) => {
  const pool = await poolPromise;
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  // Query para obtener los usuarios con sus roles y permisos (agregados por STRING_AGG)
  const usersQuery = `
    SELECT 
        u.user_id, u.user_name, u.user_surname, u.user_email, u.user_phone,
        r.role_id, r.role_name,
        STRING_AGG(p.permission_name, ',') WITHIN GROUP (ORDER BY p.permission_name) AS permissions
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.permission_id
    WHERE u.user_name LIKE @search OR u.user_email LIKE @search OR u.user_surname LIKE @search
    GROUP BY u.user_id, u.user_name, u.user_surname, u.user_email, u.user_phone, r.role_id, r.role_name
    ORDER BY u.user_id
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `;

  // Query para contar el total (necesario para la paginación en el front)
  const countQuery = `
    SELECT COUNT(*) as total FROM users 
    WHERE user_name LIKE @search OR user_email LIKE @search OR user_surname LIKE @search;
  `;

  const usersResult = await pool.request()
    .input('search', sql.VarChar, searchTerm)
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(usersQuery);

  const countResult = await pool.request()
    .input('search', sql.VarChar, searchTerm)
    .query(countQuery);

  return {
    users: usersResult.recordset.map(u => ({
      ...u,
      permissions: u.permissions ? u.permissions.split(',') : []
    })),
    total: countResult.recordset[0].total
  };
};

/**
 * Actualiza el rol de un usuario.
 */
const updateRole = async (userId, roleId) => {
  const pool = await poolPromise;
  
  // En este sistema, asumimos que un usuario tiene un rol principal (simplificación)
  // Borramos el anterior e insertamos el nuevo
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    
    await request
      .input('userId', sql.Int, userId)
      .query('DELETE FROM user_roles WHERE user_id = @userId');

    await request
      .input('roleId', sql.Int, roleId)
      .query('INSERT INTO user_roles (user_id, role_id) VALUES (@userId, @roleId)');

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  findById,
  updateUser,
  findAll,
  updateRole
};

