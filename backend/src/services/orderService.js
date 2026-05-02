const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const subscriptionService = require('./subscriptionService');
const planRepository = require('../repositories/planRepository');

const getUserHistory = async (userId) => {
    return await orderRepository.getByUserId(userId);
};

const getFullOrderDetail = async (orderId) => {
    return await orderRepository.getOrderWithDetails(orderId);
};

/**
 * Procesa un nuevo pedido calculando precios reales desde la BBDD.
 * Ahora soporta ítems de tipo 'plan' (suscripciones).
 */
const processOrder = async (userId, items) => {
    let totalPrice = 0;
    const validatedItems = [];
    let planToActivate = null;

    for (const item of items) {
        if (item.type === 'plan') {
            // Validar que el plan existe y obtener su precio real
            const plan = await planRepository.getPlanById(item.id);
            if (!plan) throw new Error(`Plan con ID ${item.id} no encontrado`);
            
            totalPrice += parseFloat(plan.plan_price);
            planToActivate = plan.plan_id;
            
            // Añadimos al registro del pedido como ítem especial
            validatedItems.push({
                id: item.id,
                quantity: 1,
                price: parseFloat(plan.plan_price),
                isPlan: true
            });
        } else {
            // Proceso normal para productos
            const product = await productRepository.getById(item.id);
            if (!product) throw new Error(`Producto con ID ${item.id} no encontrado`);

            const unitPrice = parseFloat(product.product_price);
            totalPrice += unitPrice * item.quantity;

            validatedItems.push({
                id: item.id,
                quantity: item.quantity,
                price: unitPrice,
                isPlan: false
            });
        }
    }

    // 1. Crear el pedido en la base de datos
    const order = await orderRepository.createOrder(userId, totalPrice, validatedItems);

    // 2. Si había un plan en el pedido, activarlo para el usuario
    if (planToActivate) {
        await subscriptionService.subscribeUser(userId, planToActivate);
    }

    return order;
};

module.exports = {
    getUserHistory,
    getFullOrderDetail,
    processOrder
};
