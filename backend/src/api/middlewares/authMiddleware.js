/* ==================================================================
                            authMiddleware.js
                        Middleware de autenticación
   ================================================================== */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-super-seguro';

const authUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Inyectamos el ID, ROL y PERMISOS en la request para su uso en los controladores
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userPermissions = decoded.permissions || [];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o caducado' });
  }
}

/**
 * Middleware para validar que el usuario tenga un permiso específico
 * @param {string} permissionCode 
 */
const checkPermission = (permissionCode) => {
  return (req, res, next) => {
    // Si es Admin, por defecto tiene todos los permisos (opcional, depende de tu lógica)
    if (req.userRole === 'Admin') return next();

    if (!req.userPermissions.includes(permissionCode)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere el permiso: ${permissionCode}` 
      });
    }
    next();
  };
};

module.exports = {
  authUserToken,
  checkPermission
}
