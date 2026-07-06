const userService = require('../../services/userService');

/**
 * Controlador para obtener los datos de un usuario.
 */
const getUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await userService.getUser(userId);
    
    return res.json(user);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Controlador para actualizar los datos de un usuario.
 */
const updateUser = async (req, res) => {
  try {
    const targetUserId = Number(req.params.id);
    
    // req.userId vendría de un posible middleware de autenticación que valida el token
    const requestingUserId = req.userId ? Number(req.userId) : null; 
    
    const updatedUser = await userService.updateUser(targetUserId, requestingUserId, req.body);
    
    return res.json(updatedUser);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const result = await userService.getAllUsers(search, Number(page), Number(limit));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Endpoint para que el Admin cambie el rol de un usuario.
 */
const updateRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const requestingUserId = req.userId;
    
    if (!userId || !roleId) {
      return res.status(400).json({ error: 'userId y roleId son requeridos' });
    }

    await userService.changeUserRole(Number(userId), Number(roleId), requestingUserId);
    return res.json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  getAllUsers,
  updateRole
};
