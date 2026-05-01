import React from 'react'

const ProductCard = ({ product }) => {
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
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <button type='button' className='product-card-button'>
          Añadir al carrito
        </button>
      </div>
    </article>
  )
}

export default ProductCard
