const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authUserToken } = require('../middlewares/authMiddleware');

// Rutas de usuario
router.get('/me', authUserToken, subscriptionController.getMySubscription);
router.post('/subscribe', authUserToken, subscriptionController.subscribe);
router.put('/cancel/:id', authUserToken, subscriptionController.cancel);

// Rutas de admin (paginadas)
router.get('/', subscriptionController.getSubscriptions);

module.exports = router;
