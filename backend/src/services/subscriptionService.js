const subscriptionRepository = require('../repositories/subscriptionRepository');
const planRepository = require('../repositories/planRepository');

const getUserSubscription = async (userId) => {
    return await subscriptionRepository.getActiveSubscriptionByUserId(userId);
};

const subscribeUser = async (userId, planId) => {
    // 1. Verificar si el plan existe
    const plan = await planRepository.getPlanById(planId);
    if (!plan) throw new Error('El plan seleccionado no existe');

    // 2. Verificar si ya tiene una suscripción activa
    const activeSub = await subscriptionRepository.getActiveSubscriptionByUserId(userId);
    if (activeSub) {
        // Lógica de Upgrade: Cancelar la anterior y crear la nueva
        await subscriptionRepository.cancelSubscription(activeSub.subscription_id);
    }

    // 3. Crear la nueva suscripción
    return await subscriptionRepository.createSubscription(userId, planId, plan.plan_duration);
};

const cancelUserSubscription = async (userId, subscriptionId) => {
    // Verificar que la suscripción pertenezca al usuario
    const activeSub = await subscriptionRepository.getActiveSubscriptionByUserId(userId);
    if (!activeSub || activeSub.subscription_id !== parseInt(subscriptionId)) {
        throw new Error('No se encontró una suscripción activa válida para cancelar');
    }

    return await subscriptionRepository.cancelSubscription(subscriptionId);
};

const getAdminSubscriptions = async (page, limit) => {
    return await subscriptionRepository.getSubscriptionsPaginated(page, limit);
};

module.exports = {
    getUserSubscription,
    subscribeUser,
    cancelUserSubscription,
    getAdminSubscriptions
};
