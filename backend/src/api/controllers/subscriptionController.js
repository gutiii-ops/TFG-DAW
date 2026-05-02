const subscriptionService = require('../../services/subscriptionService');

const getMySubscription = async (req, res) => {
    try {
        const userId = req.userId;
        const subscription = await subscriptionService.getUserSubscription(userId);
        res.json(subscription || { message: 'Sin suscripción activa' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const subscribe = async (req, res) => {
    try {
        const userId = req.userId;
        const { planId } = req.body;
        const result = await subscriptionService.subscribeUser(userId, planId);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const cancel = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        await subscriptionService.cancelUserSubscription(userId, id);
        res.json({ message: 'Suscripción cancelada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
    getMySubscription,
    subscribe,
    cancel,
    getSubscriptions
};
