import React, { createContext, useState, useEffect, useContext } from 'react'
import { NotificationContext } from './NotificationContext'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { addNotification } = useContext(NotificationContext)
  
  // Cargar estado inicial desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('gym_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  // Persistir en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('gym_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Acción: Añadir producto normal al carrito
  const addToCart = (product) => {
    const isExisting = cartItems.find((item) => item.id === product.id && item.type !== 'plan')
    
    if (isExisting) {
      addNotification(`${product.name} actualizado en el carrito`, 'success')
      setCartItems(prevItems => 
        prevItems.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      )
    } else {
      addNotification(`${product.name} añadido al carrito`, 'success')
      setCartItems(prevItems => [...prevItems, { ...product, quantity: 1, type: 'product' }])
    }
  }

  // Acción: Añadir plan de suscripción (Solo uno permitido)
  const addPlanToCart = (plan) => {
    // Eliminamos cualquier plan previo que haya en el carrito
    setCartItems(prevItems => {
      const filteredItems = prevItems.filter(item => item.type !== 'plan');
      return [...filteredItems, { ...plan, quantity: 1, type: 'plan' }];
    });
    addNotification(`Plan ${plan.name} seleccionado`, 'success');
    setIsCartOpen(true); // Abrimos el carrito para que el usuario vea el cambio
  }

  // Acción: Quitar una unidad (o el item si es 1)
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId)
      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item.id !== productId)
      }
      return prevItems.map((item) =>
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    })
  }

  // Acción: Eliminar ítem completo
  const deleteFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Acción: Vaciar carrito
  const clearCart = () => {
    setCartItems([])
  }

  // Cálculos derivados
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        addPlanToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
