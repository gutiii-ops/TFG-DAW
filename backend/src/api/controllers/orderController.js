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

const createOrder = async (req, res) => {
  try {
    const userId = req.userId; // Extraído del token por el middleware
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const result = await orderService.processOrder(userId, items);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder
};
