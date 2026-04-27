const authService = require('../../services/authService');

/**
 * Controlador de login.
 * Captura la petición, extrae los parámetros y delega todo al servicio.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // El servicio se encarga de todo el proceso de negocio y generación de tokens
    const result = await authService.login(email, password);
    
    return res.json(result);
  } catch (error) {
    // Si el servicio detecta un error de negocio (ej: mala contraseña = 401),
    // lo atrapamos aquí para responder limpiamente al cliente.
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
}

/**
 * Endpoint interno o middleware-helper si es necesario en un futuro.
 */
const validateToken = async (req, res) => {
  try {
    // Aquí iría `req.headers.authorization` típicamente
    const { token } = req.body; 
    const userId = await authService.validateToken(token);
    
    if(!userId) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    return res.json({ userId });
  } catch(error) {
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

module.exports = {
  login,
  validateToken
};
