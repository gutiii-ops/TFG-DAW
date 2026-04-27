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

module.exports = {
  getUser,
  updateUser
};
