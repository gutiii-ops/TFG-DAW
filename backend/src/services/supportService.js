const supportRepository = require('../repositories/supportRepository');

const getAdminSupportTickets = async (page, limit) => {
    return await supportRepository.getTicketsPaginated(page, limit);
};

const getUserTickets = async (userId) => {
    return await supportRepository.getTicketsByUser(userId);
};

const getTicketMessages = async (ticketId, userId, userRole) => {
    const ticket = await supportRepository.getById(ticketId);
    if (!ticket) {
        const error = new Error('Ticket no encontrado');
        error.status = 404;
        throw error;
    }

    // Segurización: O es administrador, o el ticket pertenece al usuario que realiza la petición
    if (userRole !== 'Admin' && ticket.user_id !== Number(userId)) {
        const error = new Error('No tienes permisos para ver este ticket');
        error.status = 403;
        throw error;
    }

    return await supportRepository.getMessagesByTicket(ticketId);
};

const createNewTicket = async (userId, subject, message) => {
    const ticketId = await supportRepository.createTicket(userId, subject);
    await supportRepository.createMessage(ticketId, userId, message);
    return { ticketId, success: true };
};

const replyToTicket = async (ticketId, senderId, message, userRole) => {
    const ticket = await supportRepository.getById(ticketId);
    if (!ticket) {
        const error = new Error('Ticket no encontrado');
        error.status = 404;
        throw error;
    }

    // Segurización para responder: O es Admin, o es el propietario del ticket
    if (userRole !== 'Admin' && ticket.user_id !== Number(senderId)) {
        const error = new Error('No autorizado para responder este ticket');
        error.status = 403;
        throw error;
    }

    await supportRepository.createMessage(ticketId, senderId, message);
    return { success: true };
};

module.exports = {
    getAdminSupportTickets,
    getUserTickets,
    getTicketMessages,
    createNewTicket,
    replyToTicket
};
