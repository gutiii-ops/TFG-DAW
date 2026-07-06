const productService = require('../../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAvailableProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const result = await productService.modifyProduct(productId, req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const result = await productService.removeProduct(productId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
