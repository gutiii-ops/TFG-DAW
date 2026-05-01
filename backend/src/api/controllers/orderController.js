const orderService = require('../../services/orderService');

const getUserOrders = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const userOrders = await orderService.getUserHistory(userId);
    return res.json(userOrders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await orderService.getFullOrderDetail(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserOrders,
  getOrderById
};
