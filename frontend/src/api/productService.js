/* ==============================================================
                        productService.js
        Servicio para obtener productos de la tienda desde la API.
================================================================ */

const categoryMap = {
  1: 'ropa',
  2: 'suplementos',
  3: 'equipamiento',
  4: 'accesorios'
}

const badgeMap = {
  1: 'NUEVO',
  2: 'TOP',
  3: 'EXCLUSIVO',
  4: 'LIMITADO'
}

const normalizeProduct = (raw) => ({
  id: raw.product_id,
  name: raw.product_name,
  category: categoryMap[raw.product_category] || 'otro',
  price: Number(raw.product_price),
  badge: badgeMap[raw.product_category] || 'PRODUCTO',
  description:
    raw.product_description ||
    `Artículo de ${categoryMap[raw.product_category] || 'categoría general'}`
})

export const getStoreProducts = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Error al cargar los productos de la tienda')
    }

    const data = await response.json()
    return Array.isArray(data) ? data.map(normalizeProduct) : []
  } catch (error) {
    console.error('Error en getStoreProducts:', error)
    return { error: error.message }
  }
}
