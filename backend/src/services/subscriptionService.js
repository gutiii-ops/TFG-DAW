const subscriptionRepository = require('../repositories/subscriptionRepository');

const getAdminSubscriptions = async (page, limit) => {
    return await subscriptionRepository.getSubscriptionsPaginated(page, limit);
};

module.exports = {
    getAdminSubscriptions
};
