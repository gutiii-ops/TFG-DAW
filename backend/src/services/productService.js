const productRepository = require('../repositories/productRepository');

/**
 * Lógica de negocio para obtener productos.
 * @returns {Promise<Array>}
 */
const getAvailableProducts = async () => {
    // Aquí se podrían aplicar filtros de stock, etc.
    return await productRepository.getAll();
};

const createProduct = async (data) => {
    if (!data.name || !data.price) {
        throw new Error('Nombre y precio son campos obligatorios');
    }
    const productId = await productRepository.create(data);
    return { success: true, productId };
};

const modifyProduct = async (productId, data) => {
    const updated = await productRepository.update(productId, data);
    if (!updated) throw new Error('No se pudo actualizar el producto');
    return { success: true };
};

const removeProduct = async (productId) => {
    const deleted = await productRepository.deleteProduct(productId);
    if (!deleted) throw new Error('No se pudo eliminar el producto');
    return { success: true };
};

module.exports = {
    getAvailableProducts,
    createProduct,
    modifyProduct,
    removeProduct
};
