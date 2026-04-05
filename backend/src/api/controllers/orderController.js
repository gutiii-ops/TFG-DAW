const { orders, order_details, products } = require('../data/mockData')

const getUserOrders = (req, res) => {
  const userId = Number(req.params.userId)
  const userOrders = orders.filter((order) => order.user_id === userId)

  return res.json(userOrders)
}

const getOrderById = (req, res) => {
  const orderId = Number(req.params.orderId)
  const order = orders.find((item) => item.order_id === orderId)

  if (!order) {
    return res.status(404).json({ error: 'Orden no encontrada' })
  }

  const details = order_details
    .filter((detail) => detail.order_id === orderId)
    .map((detail) => {
      const product = products.find(
        (item) => item.product_id === detail.product_id
      )
      return {
        detail_id: detail.detail_id,
        product_id: detail.product_id,
        product_name: product ? product.product_name : 'Producto desconocido',
        quantity: detail.quantity,
        unit_price: detail.unit_price
      }
    })

  return res.json({ ...order, details })
}

module.exports = {
  getUserOrders,
  getOrderById
}
