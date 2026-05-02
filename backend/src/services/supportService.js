const supportRepository = require('../repositories/supportRepository');

const getAdminSupportTickets = async (page, limit) => {
    return await supportRepository.getTicketsPaginated(page, limit);
};

const getUserTickets = async (userId) => {
    return await supportRepository.getTicketsByUser(userId);
};

const getTicketMessages = async (ticketId) => {
    return await supportRepository.getMessagesByTicket(ticketId);
};

const createNewTicket = async (userId, subject, message) => {
    const ticketId = await supportRepository.createTicket(userId, subject);
    await supportRepository.createMessage(ticketId, userId, message);
    return { ticketId, success: true };
};

const replyToTicket = async (ticketId, senderId, message) => {
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
