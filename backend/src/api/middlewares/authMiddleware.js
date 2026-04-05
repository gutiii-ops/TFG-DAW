/* ==================================================================
                            authMiddleware.js
                        Middleware de autenticación
   ================================================================== */

const { validateToken } = require('../controllers/authController')

const authUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]
  const userId = validateToken(token)

  if (!userId) {
    return res.status(401).json({ error: 'Token inválido o caducado' })
  }

  req.userId = userId
  next()
}

module.exports = {
  authUserToken
}
