const supportService = require('../../services/supportService');

/**
 * Obtiene todos los tickets (Admin)
 */
const getTickets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await supportService.getAdminSupportTickets(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtiene los tickets de un usuario específico (Dashboard)
 */
const getUserTickets = async (req, res) => {
    try {
        const userId = req.userId; // Extraído del token por authMiddleware
        const result = await supportService.getUserTickets(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtiene los mensajes de un ticket
 */
const getMessages = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const requestingUserId = req.userId;
        const userRole = req.userRole;

        const result = await supportService.getTicketMessages(ticketId, requestingUserId, userRole);
        res.json(result);
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

/**
 * Crea un nuevo ticket
 */
const createTicket = async (req, res) => {
    try {
        const userId = req.userId;
        const { subject, message } = req.body;
        const result = await supportService.createNewTicket(userId, subject, message);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Responde a un ticket
 */
const replyTicket = async (req, res) => {
    try {
        const senderId = req.userId;
        const userRole = req.userRole;
        const { ticketId } = req.params;
        const { message } = req.body;

        const result = await supportService.replyToTicket(ticketId, senderId, message, userRole);
        res.json(result);
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

module.exports = {
    getTickets,
    getUserTickets,
    getMessages,
    createTicket,
    replyTicket
};
