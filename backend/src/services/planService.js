const planRepository = require('../repositories/planRepository');

const getAllPlans = async () => {
    return await planRepository.getAllPlans();
};

const getPlanById = async (planId) => {
    return await planRepository.getPlanById(planId);
};

module.exports = {
    getAllPlans,
    getPlanById
};
