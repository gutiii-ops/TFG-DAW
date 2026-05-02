const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authUserToken, checkPermission } = require('../middlewares/authMiddleware');

// Rutas protegidas para el usuario (Dashboard)
router.get('/my-tickets', authUserToken, supportController.getUserTickets);
router.post('/tickets', authUserToken, supportController.createTicket);
router.get('/tickets/:ticketId/messages', authUserToken, supportController.getMessages);
router.post('/tickets/:ticketId/messages', authUserToken, supportController.replyTicket);

// Rutas para Admin (Paginadas)
router.get('/admin/all', authUserToken, checkPermission('MANAGE_SUPPORT'), supportController.getTickets);

module.exports = router;
