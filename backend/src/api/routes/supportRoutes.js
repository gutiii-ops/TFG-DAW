const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas protegidas para el usuario (Dashboard)
router.get('/my-tickets', authMiddleware, supportController.getUserTickets);
router.post('/tickets', authMiddleware, supportController.createTicket);
router.get('/tickets/:ticketId/messages', authMiddleware, supportController.getMessages);
router.post('/tickets/:ticketId/messages', authMiddleware, supportController.replyTicket);

// Rutas para Admin (Paginadas)
router.get('/admin/all', authMiddleware, supportController.getTickets);

module.exports = router;
