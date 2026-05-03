import React, { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'
import { NotificationContext } from '../../context/NotificationContext'
import '../../styles/components/store/CartDrawer.css'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
)

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    deleteFromCart, 
    cartTotal,
    clearCart
  } = useContext(CartContext)

  const { isAuthenticated, token } = useContext(AuthContext)
  const { addNotification } = useContext(NotificationContext)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      addNotification('Debes iniciar sesión para finalizar el pedido', 'warning')
      setIsCartOpen(false)
      document.dispatchEvent(new Event('openLoginModal'))
      return
    }

    try {
      setIsProcessing(true)
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: cartItems })
      })

      const data = await response.json()

      if (response.ok) {
        addNotification('¡Pedido realizado con éxito!', 'success')
        clearCart()
        setIsCartOpen(false)
      } else {
        throw new Error(data.error || 'Error al procesar el pedido')
      }
    } catch (error) {
      addNotification(error.message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isCartOpen) return null

  return (
    <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="img-placeholder">{item.type === 'plan' ? '★' : (item.category?.[0] || 'P')}</div>
                  )}
                </div>
                <div className="item-details">
                  <div className="item-title-row">
                    <h3>{item.name}</h3>
                    <button className="delete-item-icon" onClick={() => deleteFromCart(item.id)}>
                      <TrashIcon />
                    </button>
                  </div>
                  <p className="item-price-row">{item.price.toFixed(2)}€</p>
                  <div className="cart-item-controls">
                    {item.type === 'plan' ? (
                      <span className="cart-item-type-tag">Membresía</span>
                    ) : (
                      <div className="quantity-controls">
                        <button onClick={() => removeFromCart(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>{cartTotal.toFixed(2)}€</span>
            </div>
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Finalizar Pedido'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
