const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Ruta pública para ver el catálogo de planes
router.get('/', planController.getPlans);

module.exports = router;
