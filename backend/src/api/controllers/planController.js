const planService = require('../../services/planService');

const getPlans = async (req, res) => {
    try {
        const plans = await planService.getAllPlans();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPlans
};
