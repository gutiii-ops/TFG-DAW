/* =======================================================================================================================
          UserOrders.jsx - Componente funcional para interactuar con los pedidos pasados del e-commerce
======================================================================================================================= */
import React from 'react'
import '../../styles/components/user/UserOrders.css'

export const UserOrders = ({ orders }) => {
  return (
    <section className='tab-content orders-content'>
      <h2>Mis Pedidos</h2>
      <div className='orders-list'>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className={`order-item status-${order.status}`}
            >
              <div className='order-header'>
                <div className='order-id'>
                  <span className='label'>Pedido</span>
                  <span className='value'>{order.id}</span>
                </div>
                <div className='order-date'>
                  <span className='label'>Fecha</span>
                  <span className='value'>
                    {new Date(order.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className='order-status'>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status === 'delivered' && '✓ Entregado'}
                    {order.status === 'shipped' && '📦 En camino'}
                    {order.status === 'processing' && '⏳ En preparación'}
                  </span>
                </div>
              </div>
              <div className='order-items'>
                <p>{order.items}</p>
              </div>
              <div className='order-footer'>
                <span className='order-total'>
                  Total: {order.total.toFixed(2)}€
                </span>
                <button className='order-detail-btn'>Ver detalles</button>
              </div>
            </div>
          ))
        ) : (
          <p className='empty-message'>
            No tienes pedidos. ¡Visita la tienda!
          </p>
        )}
      </div>
    </section>
  )
}
