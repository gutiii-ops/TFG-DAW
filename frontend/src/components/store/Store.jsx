import React, { useEffect, useState } from 'react'
import CategoryTabs from './CategoryTabs.jsx'
import ProductCard from './ProductCard.jsx'
import { getStoreProducts } from '../../api/productService.js'
import '../../styles/components/store/store.css'

const categories = [
  { id: 'all', label: 'Todas' },
  { id: 'ropa', label: 'Ropa' },
  { id: 'suplementos', label: 'Suplementos' },
  { id: 'equipamiento', label: 'Equipamiento' },
  { id: 'accesorios', label: 'Accesorios' }
]

const Store = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)

      const response = await getStoreProducts()
      if (response.error) {
        setError(response.error)
        setProducts([])
      } else {
        setProducts(Array.isArray(response) ? response : [])
      }

      setLoading(false)
    }

    loadProducts()
  }, [])

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory)

  return (
    <section className='store-page'>
      <div className='store-hero'>
        <div className='store-intro'>
          <span className='store-tag'>Tienda oficial</span>
          <h1>Ropa, suplementos y equipamiento para cada entrenamiento</h1>
          <p>
            Descubre colecciones pensadas para entrenar más fuerte, recuperar
            mejor y mantener tu estilo dentro y fuera del gimnasio.
          </p>
        </div>
        <div className='store-metrics'>
          <div className='metric-card'>
            <span>{products.length}</span>
            <p>Productos disponibles</p>
          </div>
          <div className='metric-card'>
            <span>{categories.length}</span>
            <p>Categorías activas</p>
          </div>
          <div className='metric-card'>
            <span>100%</span>
            <p>Garantía de calidad</p>
          </div>
        </div>
      </div>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <div className='store-grid'>
        <aside className='store-sidebar'>
          <div className='sidebar-card'>
            <h2>Categorías</h2>
            <p>Selecciona una categoría para filtrar productos similares.</p>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type='button'
                    className={
                      category.id === activeCategory ? 'category-active' : ''
                    }
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='sidebar-card'>
            <h2>Atención</h2>
            <p>
              Envios rápidos a toda España. Cambios y devoluciones fáciles en 14
              días.
            </p>
          </div>
        </aside>

        <div className='product-list'>
          {loading ? (
            <div className='store-loading'>Cargando productos...</div>
          ) : error ? (
            <div className='store-error'>{error}</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className='store-empty'>
              No hay productos disponibles en esta categoría.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Store
