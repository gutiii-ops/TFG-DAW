const express = require('express');
const router = express.Router();
const { authUserToken } = require('../middlewares/authMiddleware');
const {
  getMyCoachSessions,
  createCoachSession,
  updateCoachSession,
  deleteCoachSession
} = require('../controllers/coachController');

// Middleware de rol: solo Coaches pueden usar estas rutas
const requireCoach = (req, res, next) => {
  if (req.userRole !== 'Coach' && req.userRole !== 'Admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol Coach.' });
  }
  next();
};

router.get('/', authUserToken, requireCoach, getMyCoachSessions);
router.post('/', authUserToken, requireCoach, createCoachSession);
router.put('/:sessionId', authUserToken, requireCoach, updateCoachSession);
router.delete('/:sessionId', authUserToken, requireCoach, deleteCoachSession);

module.exports = router;
