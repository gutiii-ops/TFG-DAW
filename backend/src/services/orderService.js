const orderRepository = require('../repositories/orderRepository');

const getUserHistory = async (userId) => {
    return await orderRepository.getByUserId(userId);
};

const getFullOrderDetail = async (orderId) => {
    return await orderRepository.getOrderWithDetails(orderId);
};

module.exports = {
    getUserHistory,
    getFullOrderDetail
};
