import React, { useState, useEffect } from 'react';

const OrdersSection = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`http://localhost:8000/api/orders/user/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchOrders();
  }, [user]);

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    // Si no tenemos los detalles cacheamos, los pedimos
    if (!orderDetails[orderId]) {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(prev => ({ ...prev, [orderId]: data.details }));
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="minimal-spinner"></div>
        <p>Sincronizando tu historial...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders-state">
        <div className="empty-icon">📦</div>
        <h2>Aún no tienes pedidos</h2>
        <p>Tus compras en la tienda aparecerán aquí automáticamente.</p>
        <button className="go-store-btn" onClick={() => window.location.href='/store'}>
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="content-header">
        <h1>Mis Compras</h1>
        <p>Gestiona y revisa el historial de tus pedidos realizados.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.order_id} className={`order-card ${expandedOrder === order.order_id ? 'is-expanded' : ''}`}>
            <div className="order-main-info" onClick={() => toggleOrderDetails(order.order_id)}>
              <div className="order-id-block">
                <span className="label">PEDIDO</span>
                <span className="value">#{order.order_id}</span>
              </div>
              <div className="order-date-block">
                <span className="label">FECHA</span>
                <span className="value">{new Date(order.order_date).toLocaleDateString()}</span>
              </div>
              <div className="order-total-block">
                <span className="label">TOTAL</span>
                <span className="value">{Number(order.total_price).toFixed(2)}€</span>
              </div>
              <div className="order-status-block">
                <span className="status-badge completed">Completado</span>
              </div>
              <div className="order-chevron">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {expandedOrder === order.order_id && (
              <div className="order-details-expanded">
                <h4>Productos en este pedido</h4>
                <div className="details-table">
                  {orderDetails[order.order_id] ? (
                    orderDetails[order.order_id].map((item, idx) => (
                      <div key={idx} className="detail-row">
                        <span className="product-name">{item.product_name}</span>
                        <span className="product-qty">x{item.quantity}</span>
                        <span className="product-price">{(item.unit_price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))
                  ) : (
                    <p className="loading-details">Cargando detalles...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
