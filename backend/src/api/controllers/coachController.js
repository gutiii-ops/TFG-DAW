const coachingService = require('../../services/coachingService');

/**
 * Devuelve las sesiones propias del coach autenticado.
 */
const getMyCoachSessions = async (req, res) => {
  try {
    const sessions = await coachingService.getCoachSessions(req.userId);
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Crea una nueva sesión para el coach autenticado.
 */
const createCoachSession = async (req, res) => {
  try {
    console.log('Creando sesión para coachId:', req.userId, 'con data:', req.body);
    const result = await coachingService.createCoachSession(req.userId, req.body);
    console.log('Sesión creada:', result);
    return res.status(201).json(result);
  } catch (error) {
    console.log('Error creando sesión:', error.message);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Actualiza una sesión del coach autenticado.
 */
const updateCoachSession = async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);
    const isAdmin = req.userRole === 'Admin';
    const result = await coachingService.updateCoachSession(sessionId, req.userId, req.body, isAdmin);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Elimina una sesión del coach autenticado.
 */
const deleteCoachSession = async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);
    const isAdmin = req.userRole === 'Admin';
    const result = await coachingService.deleteCoachSession(sessionId, req.userId, isAdmin);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getMyCoachSessions,
  createCoachSession,
  updateCoachSession,
  deleteCoachSession
};
