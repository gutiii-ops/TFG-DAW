/* ==============================================================
                        orderService.js
        Servicio para obtener órdenes de compra del usuario.
================================================================ */

const normalizeOrder = (raw) => {
  const statusOptions = ['processing', 'shipped', 'delivered']
  const statusIndex = raw.order_id % statusOptions.length
  return {
    id: raw.order_id,
    date: raw.order_date,
    total: Number(raw.total_price),
    status: raw.order_status || statusOptions[statusIndex],
    items:
      raw.summary || `Pedido con importe ${Number(raw.total_price).toFixed(2)}€`
  }
}

export const getUserOrders = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/orders/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error al obtener órdenes')
    }
    const data = await response.json()
    return Array.isArray(data) ? data.map(normalizeOrder) : []
  } catch (error) {
    console.error('Error en getUserOrders:', error)
    return { error: error.message }
  }
}

export const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || 'Error al obtener detalles de la orden'
      )
    }
    const data = await response.json()
    return {
      id: data.order_id,
      date: data.order_date,
      total: Number(data.total_price),
      items: Array.isArray(data.details)
        ? data.details.map((detail) => ({
            productId: detail.product_id,
            productName: detail.product_name,
            quantity: detail.quantity,
            unitPrice: Number(detail.unit_price)
          }))
        : []
    }
  } catch (error) {
    console.error('Error en getOrderDetails:', error)
    return { error: error.message }
  }
}
