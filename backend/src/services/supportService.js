const supportRepository = require('../repositories/supportRepository');

const getAdminSupportTickets = async (page, limit) => {
    return await supportRepository.getTicketsPaginated(page, limit);
};

module.exports = {
    getAdminSupportTickets
};
