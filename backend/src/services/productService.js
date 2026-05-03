const productRepository = require('../repositories/productRepository');

/**
 * Lógica de negocio para obtener productos.
 * @returns {Promise<Array>}
 */
const getAvailableProducts = async () => {
    // Aquí se podrían aplicar filtros de stock, etc.
    return await productRepository.getAll();
};

module.exports = {
    getAvailableProducts
};
