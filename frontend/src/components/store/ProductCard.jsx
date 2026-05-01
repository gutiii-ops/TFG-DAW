import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  return (
    <article className='product-card'>
      <div className='product-card-image'>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <span>{product.category.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className='product-card-body'>
        <div className='product-card-meta'>
          <span className='product-card-badge'>{product.badge}</span>
          <span className='product-card-price'>
            {product.price.toFixed(2)}€
          </span>
        </div>
        <h3 className='product-card-title'>{product.name}</h3>
        <div className='product-card-description'>
          <p>{product.description}</p>
        </div>
        <button 
          type='button' 
          className='product-card-button'
          onClick={() => addToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </article>
  )
}

export default ProductCard
