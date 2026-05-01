const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');

const getUserHistory = async (userId) => {
    return await orderRepository.getByUserId(userId);
};

const getFullOrderDetail = async (orderId) => {
    return await orderRepository.getOrderWithDetails(orderId);
};

/**
 * Procesa un nuevo pedido calculando precios reales desde la BBDD.
 */
const processOrder = async (userId, items) => {
    let totalPrice = 0;
    const validatedItems = [];

    // Validar cada producto y obtener su precio actual
    for (const item of items) {
        const product = await productRepository.getById(item.id);
        if (!product) throw new Error(`Producto con ID ${item.id} no encontrado`);

        const unitPrice = product.product_price;
        totalPrice += unitPrice * item.quantity;

        validatedItems.push({
            id: item.id,
            quantity: item.quantity,
            price: unitPrice
        });
    }

    return await orderRepository.createOrder(userId, totalPrice, validatedItems);
};

module.exports = {
    getUserHistory,
    getFullOrderDetail,
    processOrder
};
