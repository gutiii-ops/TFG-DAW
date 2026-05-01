const subscriptionService = require('../services/subscriptionService');

const getSubscriptions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await subscriptionService.getAdminSubscriptions(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSubscriptions
};
